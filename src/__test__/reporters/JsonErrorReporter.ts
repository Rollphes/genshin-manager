import type { Reporter, TaskResultPack } from 'vitest'

interface ErrorInfo {
  message?: string
  stack?: string
}

interface TaskInfo {
  name?: string
  result?: {
    state?: string
    errors?: ErrorInfo[]
  }
}

/**
 * Custom Vitest reporter that analyzes test failures and identifies related JSON files
 */
export default class JsonErrorReporter implements Reporter {
  /**
   * Called when tasks are updated
   */
  public onTaskUpdate(packs: TaskResultPack[]): void {
    for (const pack of packs) {
      // pack[0] is task id, pack[1] is task result, pack[2] is task meta
      const taskId = pack[0]
      const taskResult = pack[1] as TaskInfo['result'] | undefined

      if (taskResult?.state === 'fail')
        this.analyzeJsonError(taskId, taskResult)
    }
  }

  /**
   * Analyze a failed task for JSON-related errors
   */
  private analyzeJsonError(
    taskId: string,
    result: NonNullable<TaskInfo['result']>,
  ): void {
    const errors = result.errors
    if (!errors || errors.length === 0) return

    for (const error of errors) {
      const message = error.message ?? ''
      const stack = error.stack ?? ''
      const combined = `${message}\n${stack}`

      // Extract JSON file names from error message/stack
      const jsonFiles = this.extractJsonFileNames(combined)

      if (jsonFiles.size > 0) this.printJsonAnalysis(taskId, jsonFiles)
    }
  }

  /**
   * Extract JSON file names from error text
   */
  private extractJsonFileNames(text: string): Set<string> {
    const jsonFiles = new Set<string>()

    // Pattern for ExcelConfigData files
    const excelConfigPattern = /([A-Za-z]+ExcelConfigData)/g
    let match: RegExpExecArray | null

    while ((match = excelConfigPattern.exec(text)) !== null)
      jsonFiles.add(match[1])

    // Pattern for master file paths
    const masterFilePattern = /masterFiles\/([A-Za-z]+)\.master\.json/g
    while ((match = masterFilePattern.exec(text)) !== null)
      jsonFiles.add(match[1])

    // Pattern for cache file paths
    const cacheFilePattern = /cache\/ExcelBinOutput\/([A-Za-z]+)\.json/g
    while ((match = cacheFilePattern.exec(text)) !== null)
      jsonFiles.add(match[1])

    return jsonFiles
  }

  /**
   * Print analysis of JSON-related files
   */
  private printJsonAnalysis(taskId: string, jsonFiles: Set<string>): void {
    const separator = '─'.repeat(60)

    console.log(`\n${separator}`)
    console.log('🔍 JSON File Analysis')
    console.log(`   Test: ${taskId}`)
    console.log(separator)

    for (const fileName of jsonFiles) {
      console.log(`\n  📁 ${fileName}`)
      console.log(`     Master: masterFiles/${fileName}.master.json`)
      console.log(`     Cache:  cache/ExcelBinOutput/${fileName}.json`)
    }

    console.log('\n  💡 Debug Steps:')
    console.log('     1. Check if the master file exists and is valid JSON')
    console.log(
      '     2. Verify the cache file structure matches the master file',
    )
    console.log(
      '     3. Run: npx tsx scripts/generate-structural-master.ts -t <fileName>',
    )
    console.log(
      '     4. Compare with a known working version of the master file',
    )

    console.log(`\n${separator}\n`)
  }
}
