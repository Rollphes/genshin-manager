import {
  type Annotation,
  InputData,
  IssueAnnotationData,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core'

/**
 * Warning extracted from quicktype annotations
 */
export interface QuicktypeWarning {
  /** Warning type */
  type: 'any' | 'null'
  /** Warning message */
  message: string
  /** Line number where issue was detected */
  line: number
  /** Column number where issue was detected */
  column: number
}

/**
 * Result from quicktype generation
 */
export interface QuicktypeResult {
  /** Generated Zod schema string */
  schema: string
  /** Warnings from type inference issues */
  warnings: QuicktypeWarning[]
}

/**
 * Wrapper for quicktype to generate Zod schemas from JSON samples
 */
export class QuicktypeRunner {
  /**
   * Generate Zod schema from JSON samples
   * @param typeName - name of the type to generate
   * @param samples - array of JSON strings
   * @returns generated Zod schema and warnings
   */
  public async generate(
    typeName: string,
    samples: string[],
  ): Promise<QuicktypeResult> {
    const jsonInput = jsonInputForTargetLanguage('typescript-zod')
    await jsonInput.addSource({
      name: typeName,
      samples,
    })

    const inputData = new InputData()
    inputData.addInput(jsonInput)

    const result = await quicktype({
      inputData,
      lang: 'typescript-zod',
      rendererOptions: {
        'just-types': 'false',
      },
    })

    const warnings = this.extractWarnings(result.annotations)

    return {
      schema: result.lines.join('\n'),
      warnings,
    }
  }

  /**
   * Extract warnings from quicktype annotations
   * @param annotations - annotations from quicktype result
   * @returns array of warnings
   */
  private extractWarnings(
    annotations: readonly Annotation[],
  ): QuicktypeWarning[] {
    return annotations
      .filter((a) => a.annotation instanceof IssueAnnotationData)
      .map((a) => ({
        type: this.getWarningType(a.annotation),
        message: (a.annotation as IssueAnnotationData).message,
        line: a.span.start.line,
        column: a.span.start.column,
      }))
  }

  /**
   * Get warning type from annotation
   * @param annotation - annotation data
   * @returns warning type
   */
  private getWarningType(annotation: unknown): 'any' | 'null' {
    if (!(annotation instanceof IssueAnnotationData)) return 'any'

    const message = annotation.message.toLowerCase()
    if (message.includes('null')) return 'null'
    return 'any'
  }
}
