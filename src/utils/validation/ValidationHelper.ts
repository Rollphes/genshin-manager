import { z } from 'zod'

import type { ErrorContext } from '@/errors/base/ErrorContext'
import { EnumValidationError } from '@/errors/validation/EnumValidationError'
import { FormatValidationError } from '@/errors/validation/FormatValidationError'
import { RequiredFieldError } from '@/errors/validation/RequiredFieldError'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Validation helper utilities for type-safe validation with error handling
 */
export class ValidationHelper {
  private constructor() {
    // Private constructor to prevent instantiation
  }
  /**
   * Validate data against a Zod schema with proper error handling
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @param context - Additional error context
   * @returns validated data
   * @throws ValidationError if validation fails
   */
  public static validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: ErrorContext,
  ): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError)
        throw ValidationError.fromZodError(error, context)

      throw error
    }
  }

  /**
   * Validate object with multiple properties
   * @param obj - Object to validate
   * @param validations - Validation configurations for each property
   * @param context - Additional error context
   * @returns validated object
   * @throws ValidationError if any property validation fails
   */
  public static validateObject<T extends Record<string, unknown>>(
    obj: unknown,
    validations: {
      [K in keyof T]: z.ZodSchema<T[K]>
    },
    context?: ErrorContext,
  ): T {
    if (typeof obj !== 'object' || obj === null)
      throw new ValidationError('Expected object for validation', context)

    const typedObj = obj as Record<string, unknown>
    const result: Partial<T> = {}

    for (const [key, schema] of Object.entries(validations)) {
      try {
        const validatedResult = ValidationHelper.validate(
          schema as z.ZodSchema,
          typedObj[key],
          {
            ...context,
            propertyKey: key,
            validationPath: key,
          },
        )
        result[key as keyof T] = validatedResult as T[keyof T]
      } catch (error) {
        if (error instanceof ValidationError) {
          const objectContext = {
            ...error.context,
            operation: 'object property validation',
            metadata: {
              ...error.context?.metadata,
              objectKey: key,
            },
          }
          throw error.withContext(objectContext)
        }
        throw error
      }
    }

    return result as T
  }

  /**
   * Safely validate data and return result with success/error information
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @param context - Additional error context
   * @returns validation result
   */
  public staticsafeValidate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: ErrorContext,
  ): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
      const result = schema.parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: ValidationError.fromZodError(error, context),
        }
      }

      // Re-throw non-Zod errors
      throw error
    }
  }

  /**
   * Validate required field
   * @param value - Value to validate
   * @param fieldName - Name of the field being validated
   * @param context - Additional error context
   * @returns validated value
   * @throws RequiredFieldError if validation fails
   */
  public staticvalidateRequired<T>(
    value: T | null | undefined,
    fieldName: string,
    context?: ErrorContext,
  ): T {
    if (value === null || value === undefined)
      throw new RequiredFieldError(fieldName, context)

    return value
  }

  /**
   * Validate enum value
   * @param value - Value to validate
   * @param allowedValues - Array of allowed values
   * @param fieldName - Name of the field being validated
   * @param context - Additional error context
   * @returns validated value
   * @throws EnumValidationError if validation fails
   */
  public staticvalidateEnum<T>(
    value: unknown,
    allowedValues: readonly T[],
    fieldName: string,
    context?: ErrorContext,
  ): T {
    if (!allowedValues.includes(value as T)) {
      throw new EnumValidationError(
        value,
        [...allowedValues],
        fieldName,
        context,
      )
    }

    return value as T
  }

  /**
   * Validate string format using regex
   * @param value - String to validate
   * @param pattern - Regex pattern
   * @param fieldName - Name of the field being validated
   * @param expectedFormat - Description of expected format
   * @param context - Additional error context
   * @returns validated string
   * @throws FormatValidationError if validation fails
   */
  public staticvalidateFormat(
    value: string,
    pattern: RegExp,
    fieldName: string,
    expectedFormat: string,
    context?: ErrorContext,
  ): string {
    if (!pattern.test(value))
      throw new FormatValidationError(fieldName, expectedFormat, value, context)

    return value
  }

  /**
   * Create a validation function from a Zod schema
   * @param schema - Zod schema
   * @param fieldName - Name of the field for error messages
   * @returns validation function
   */
  public staticcreateValidator<T>(
    schema: z.ZodSchema<T>,
    fieldName: string,
  ): (data: unknown, context?: ErrorContext) => T {
    return (data: unknown, context?: ErrorContext): T => {
      return ValidationHelper.validate(schema, data, {
        ...context,
        propertyKey: fieldName,
      })
    }
  }

  /**
   * Batch validate multiple values with different schemas
   * @param validations - Array of validation configurations
   * @returns array of validated values
   * @throws ValidationError if any validation fails
   */
  public staticbatchValidate<T extends readonly unknown[]>(validations: {
    readonly [K in keyof T]: {
      schema: z.ZodSchema<T[K]>
      data: unknown
      fieldName: string
      context?: ErrorContext
    }
  }): T {
    const results: unknown[] = []

    for (let i = 0; i < validations.length; i++) {
      const validation = validations[i]
      try {
        const result = ValidationHelper.validate(
          validation.schema,
          validation.data,
          {
            ...validation.context,
            propertyKey: validation.fieldName,
            validationPath: `batch[${i.toString()}].${validation.fieldName}`,
          },
        )
        results[i] = result
      } catch (error) {
        if (error instanceof ValidationError) {
          // Add batch context to the error
          const batchContext = {
            ...error.context,
            operation: 'batch validation',
            metadata: {
              ...error.context?.metadata,
              batchIndex: i,
              batchFieldName: validation.fieldName,
            },
          }
          throw error.withContext(batchContext)
        }
        throw error
      }
    }

    return Object.freeze(results) as T
  }
}
