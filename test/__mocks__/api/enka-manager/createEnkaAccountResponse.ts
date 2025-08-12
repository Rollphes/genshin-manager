import type { APIOwner } from '@/types/enkaNetwork'

/**
 * Create mock EnkaAccount API response for testing
 * @param username Username to use in the response
 * @returns Mock APIOwner response
 */
export function createEnkaAccountResponse(username: string): APIOwner {
  return {
    hash: 'abc123def456',
    username,
    profile: {
      bio: `Bio for ${username}`,
      level: 10,
      signup_state: 1,
      avatar: null,
      image_url: 'https://example.com/avatar.png',
    },
    id: 12345,
  }
}
