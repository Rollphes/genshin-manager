/**
 * Error thrown when a response.body is not found
 */
export class BodyNotFoundError extends Error {
    public readonly url: string

    /**
     * Create a BodyNotFoundError
     * @param url URL of the request
     */
    constructor(url: string) {
        super(`Body not found: ${url}`)

        this.name = 'ImageNotFoundError'
        this.url = url
    }
}
