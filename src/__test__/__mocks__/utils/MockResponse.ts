/**
 * Mock Response class for testing fetch API responses
 * Implements Partial<Response> to provide minimal Response interface
 */
export class MockResponse implements Partial<Response> {
  public ok: boolean
  public status: number
  public statusText: string
  public url: string

  private data: unknown

  /**
   * Creates a mock Response object
   * @param data - The data to return from json() method
   * @param options - Response configuration options
   */
  constructor(
    data: unknown,
    options: {
      ok?: boolean
      status?: number
      statusText?: string
      url?: string
    } = {},
  ) {
    this.data = data
    this.status = options.status ?? 200
    this.statusText = options.statusText ?? 'OK'
    this.url = options.url ?? 'https://test.com'
    // Set ok based on status code if not explicitly provided
    this.ok = options.ok ?? (this.status >= 200 && this.status < 300)
  }

  /**
   * Mock implementation of Response.json()
   * @returns Promise resolving to the mock data
   */
  public async json(): Promise<unknown> {
    return this.ok
      ? Promise.resolve(this.data)
      : Promise.reject(new Error('Response not ok'))
  }
}
