import type { APIGameAccount } from '@/types/enkaNetwork'

/**
 * Create mock GenshinAccounts API response for testing
 * @returns Mock APIGameAccount record response
 */
export function createGenshinAccountsResponse(): Record<
  string,
  APIGameAccount
> {
  return {
    account1: {
      uid: 123456789,
      uid_public: true,
      public: true,
      live_public: true,
      verified: true,
      hash: 'hash123',
      region: 'os_usa',
      order: 1,
      avatar_order: {},
      hoyo_type: 0, // Genshin Impact
      player_info: {
        nickname: 'TestPlayer1',
        level: 60,
        signature: 'Test signature',
        worldLevel: 8,
        nameCardId: 210001,
        finishAchievementNum: 500,
        towerFloorIndex: 12,
        towerLevelIndex: 3,
        showAvatarInfoList: [
          {
            avatarId: 10000002,
            level: 90,
          },
        ],
        showNameCardIdList: [210001],
        profilePicture: {
          avatarId: 10000002,
        },
      },
    },
    account2: {
      uid: 987654321,
      uid_public: false,
      public: true,
      live_public: false,
      verified: false,
      hash: 'hash456',
      region: 'os_euro',
      order: 2,
      avatar_order: {},
      hoyo_type: 0, // Genshin Impact
      player_info: {
        nickname: 'TestPlayer2',
        level: 45,
        signature: 'Another test signature',
        worldLevel: 6,
        nameCardId: 210002,
        finishAchievementNum: 300,
        towerFloorIndex: 10,
        towerLevelIndex: 1,
        showAvatarInfoList: [
          {
            avatarId: 10000003,
            level: 80,
          },
        ],
        showNameCardIdList: [210002],
        profilePicture: {
          avatarId: 10000003,
        },
      },
    },
  }
}
