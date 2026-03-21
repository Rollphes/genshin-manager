import { AnimeGameDataClient } from '@genshin-manager/rest'
import {
  type AnchorChange,
  AnchorGeneratorCLI,
} from '@scripts/cli/AnchorGeneratorCLI'

import { AnchorMerge } from '@/anchor/AnchorMerge'
import { AnchorSet } from '@/anchor/AnchorSet'
import { CrossFileAnalysis } from '@/anchor/CrossFileAnalysis'
import { PathFeatures } from '@/feature/PathFeatures'
import { FlatEntries } from '@/flatten/FlatEntries'
import { loadAnchor } from '@/io/loadAnchor'
import { generateAnchorMap, saveAnchor } from '@/io/saveAnchor'
import {
  type Anchor,
  type AnchorFile,
  type AnchorName,
  type FileFeatures,
} from '@/types'
import type { JsonObject } from '@/types/json'

interface AnalysisEntry {
  data: JsonObject[]
  anchorSet: AnchorSet
  crossFileAnchors: Anchor[]
}

const cli = new AnchorGeneratorCLI()
const client = new AnimeGameDataClient()

/**
 * Load all files from GitLab
 * @param allFiles - list of anchor names to load
 * @param ref - commit SHA or branch name (optional)
 * @returns map of anchor name to data
 */
async function loadAllFiles(
  allFiles: AnchorName[],
  ref?: string,
): Promise<Map<AnchorName, JsonObject[]>> {
  const entries = await cli.runTasks(
    'Loading files',
    allFiles,
    async (name): Promise<[AnchorName, JsonObject[]]> => {
      const raw = await client.fetchExcelBinOutput(name, ref)
      return [name, JSON.parse(raw) as JsonObject[]]
    },
    (name) => name,
  )
  return new Map(entries)
}

async function runMode(
  analysisMap: Map<AnchorName, AnalysisEntry>,
  isOverwrite: boolean,
  taskTitle: string,
  commit: string,
): Promise<{
  anchorFiles: AnchorFile[]
  changes: AnchorChange[]
}> {
  const results = await cli.runTasks(
    taskTitle,
    [...analysisMap.entries()],
    ([name, entry]): [AnchorFile, AnchorChange | null] => {
      const { data, anchorSet, crossFileAnchors } = entry

      const resolvedKeys = new Set(crossFileAnchors.map((a) => a.correctKey))
      const excludedKeys = anchorSet.excludedKeys.filter(
        (key) => !resolvedKeys.has(key),
      )

      let anchors = anchorSet.anchors
      let finalCrossFileAnchors = crossFileAnchors
      let change: AnchorChange | null = null

      if (!isOverwrite) {
        let existingFile: AnchorFile | null = null
        try {
          existingFile = loadAnchor(name)
        } catch {
          // File not found - will generate new
        }
        let preserved = new Set<string>()
        let lost = new Set<string>()

        if (existingFile) {
          const merge = new AnchorMerge(
            { anchors: anchorSet.anchors, crossFileAnchors },
            {
              anchors: existingFile.anchors,
              crossFileAnchors: existingFile.crossFileAnchors,
            },
          )
          anchors = merge.anchors
          finalCrossFileAnchors = merge.crossFileAnchors
          preserved = merge.preserved
          lost = merge.lost
        }
        change = {
          anchorName: name,
          preserved: [...preserved],
          lost: [...lost],
        }
      }

      const anchorFile: AnchorFile = {
        metadata: {
          sourceFile: name,
          commitId: commit,
          generatedAt: new Date().toISOString(),
          totalElements: data.length,
        },
        anchors,
        crossFileAnchors: finalCrossFileAnchors,
        derivedAncestorKeys: anchorSet.derivedAncestorKeys,
        excludedKeys,
      }

      return [anchorFile, change]
    },
    ([name]) => name,
  )

  const anchorFiles = results.map(([file]) => file)
  const changes = results
    .map(([, change]) => change)
    .filter((c): c is AnchorChange => c !== null)

  return {
    anchorFiles,
    changes,
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  cli.intro()

  const commits = await client.fetchCommits()
  const options = await cli.selectOptions(commits)
  if (!options) {
    cli.outro('Cancelled')
    process.exit(0)
  }

  const dataMap = await loadAllFiles(options.anchorNames, options.commit)

  const featuresEntries = await cli.runTasks(
    'Extracting features',
    [...dataMap.entries()],
    ([name, data]): Promise<[AnchorName, FileFeatures]> => {
      const features = data.map((element) => {
        const { entries } = new FlatEntries(element)
        return new PathFeatures(entries).features
      })
      return Promise.resolve([name, features])
    },
    ([name]) => name,
  )
  const featuresMap = new Map(featuresEntries)

  const crossFileAnalysis = new CrossFileAnalysis(featuresMap)

  const analysisEntries = await cli.runTasks(
    'Building anchorSet & cross-file analysis',
    [...dataMap.entries()],
    ([name, data]): Promise<[AnchorName, AnalysisEntry]> => {
      const anchorSet = new AnchorSet(featuresMap.get(name) ?? [])
      return Promise.resolve([
        name,
        {
          data,
          anchorSet,
          crossFileAnchors: crossFileAnalysis
            .getCrossFileAnchors(anchorSet.excludedKeys)
            .map((cfa) => CrossFileAnalysis.toAnchor(cfa)),
        },
      ])
    },
    ([name]) => name,
  )
  const analysisMap = new Map(analysisEntries)

  let tasksTitle = ''
  switch (options.mode) {
    case 'full':
      tasksTitle = 'Generating Override'
      break
    case 'preserve':
      tasksTitle = 'Generating Preserve'
      break
    case 'analyze':
      tasksTitle = 'Analyzing'
      break
  }

  const { anchorFiles, changes } = await runMode(
    analysisMap,
    options.mode === 'full',
    tasksTitle,
    options.commit,
  )

  switch (options.mode) {
    case 'full':
      cli.showSummary(anchorFiles, options.mode)
      cli.saveReport(anchorFiles, changes, options.mode)
      if (!(await cli.confirmOverwrite())) {
        cli.outro('Cancelled')
        break
      }
      for (const anchorFile of anchorFiles)
        await saveAnchor(anchorFile.metadata.sourceFile, anchorFile)
      await generateAnchorMap(anchorFiles.map((f) => f.metadata.sourceFile))
      cli.outro('Generation complete')
      break
    case 'preserve':
      cli.showChangesFromExisting(changes)
      cli.showSummary(anchorFiles, options.mode)
      cli.saveReport(anchorFiles, changes, options.mode)
      for (const anchorFile of anchorFiles)
        await saveAnchor(anchorFile.metadata.sourceFile, anchorFile)
      await generateAnchorMap(anchorFiles.map((f) => f.metadata.sourceFile))
      cli.outro('Generation complete with preservation')
      break
    case 'analyze':
      cli.showHighExclusionFiles(anchorFiles)
      cli.showChangesFromExisting(changes)
      cli.showSummary(anchorFiles, options.mode)
      cli.saveReport(anchorFiles, changes, options.mode)
      cli.outro('Analysis complete')
      break
  }
}

main().catch((error: unknown) => {
  console.error(`Fatal error: ${String(error)}`)
  process.exit(1)
})
