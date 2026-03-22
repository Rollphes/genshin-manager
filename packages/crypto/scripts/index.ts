import * as path from 'node:path'

import { AnimeGameDataClient } from '@genshin-manager/rest'
import { AnchorCLI } from '@scripts/cli/AnchorCLI'
import { DataLoader } from '@scripts/loader/DataLoader'
import { AnalyzeMode } from '@scripts/mode/AnalyzeMode'
import { GenerateMode } from '@scripts/mode/GenerateMode'
import { AnchorProcessor } from '@scripts/processor/AnchorProcessor'
import { FeatureExtractor } from '@scripts/processor/FeatureExtractor'
import { AnchorFileWriter } from '@scripts/writer/AnchorFileWriter'
import { AnchorMapWriter } from '@scripts/writer/AnchorMapWriter'

const GENERATED_OUTPUT_PATH = path.resolve(__dirname, '../src/generated')

const cli = new AnchorCLI()
const client = new AnimeGameDataClient()

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

  const loader = new DataLoader(client, cli)
  const dataMap = await loader.loadAll(options.anchorNames, options.commit)

  const extractor = new FeatureExtractor(cli)
  const featuresMap = await extractor.extractAll(dataMap)

  const processor = new AnchorProcessor(cli)
  const analysisMap = await processor.buildAnalysis(dataMap, featuresMap)

  const anchorFileWriter = new AnchorFileWriter(GENERATED_OUTPUT_PATH)
  const anchorMapWriter = new AnchorMapWriter(GENERATED_OUTPUT_PATH)

  switch (options.mode) {
    case 'full': {
      const mode = new GenerateMode(
        cli,
        anchorFileWriter,
        anchorMapWriter,
        options.commit,
        true,
      )
      await mode.run(analysisMap)
      break
    }
    case 'preserve': {
      const mode = new GenerateMode(
        cli,
        anchorFileWriter,
        anchorMapWriter,
        options.commit,
        false,
      )
      await mode.run(analysisMap)
      break
    }
    case 'analyze': {
      const mode = new AnalyzeMode(cli, options.commit)
      await mode.run(analysisMap)
      break
    }
  }
}

main().catch((error: unknown) => {
  console.error(`Fatal error: ${String(error)}`)
  process.exit(1)
})
