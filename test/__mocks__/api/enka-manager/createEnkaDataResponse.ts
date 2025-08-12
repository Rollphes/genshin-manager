import type { APIEnkaData } from '@/types/enkaNetwork/EnkaTypes'

/**
 * Create mock EnkaData API response for testing
 * @param uid UID to use in the response
 * @param withCharacters Whether to include character data
 * @param ttl TTL value for cache testing
 * @returns Mock APIEnkaData response
 */
export function createEnkaDataResponse(
  uid: number,
  withCharacters = true,
  ttl = 60,
): APIEnkaData {
  const baseResponse: APIEnkaData = {
    uid,
    playerInfo: {
      nickname: `Player${String(uid)}`,
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
    ttl,
  }

  if (withCharacters) {
    baseResponse.avatarInfoList = [
      {
        avatarId: 10000002,
        propMap: {
          1001: {
            val: '20000',
          },
          1002: {
            val: '2000',
          },
          4001: {
            val: '90',
          },
        },
        fightPropMap: {
          1: 20000,
          2: 2000,
          3: 1500,
          4: 200,
          5: 0.5,
          6: 0.5,
          7: 1.2,
          8: 0.3,
          9: 0.0,
          10: 0.0,
          11: 0.0,
          12: 0.5,
          13: 0.5,
          20: 1500,
          21: 200,
          22: 1.2,
          23: 0.3,
          26: 0.0,
          27: 0.0,
          28: 0.0,
          29: 0.0,
          30: 0.0,
          40: 0.0,
          41: 0.0,
          42: 0.0,
          43: 0.0,
          44: 0.0,
          45: 0.0,
          46: 0.0,
          50: 0.0,
          51: 0.0,
          52: 0.0,
          53: 0.0,
          54: 0.0,
          55: 0.0,
          56: 0.0,
          70: 0.0,
          71: 0.0,
          72: 0.0,
          73: 0.0,
          74: 0.0,
          75: 0.0,
          76: 0.0,
          80: 0.0,
          81: 0.0,
          1000: 1,
          1010: 90,
          2000: 20000,
          2001: 2000,
          2002: 1500,
          2003: 200,
        },
        skillDepotId: 502,
        skillLevelMap: {
          10023: 10,
          10024: 10,
          10025: 10,
        },
        proudSkillExtraLevelMap: {
          522305: 3,
          522306: 3,
          522307: 3,
        },
        equipList: [
          {
            itemId: 11501,
            weapon: {
              level: 90,
              promoteLevel: 6,
              affixMap: {
                111501: 4,
              },
            },
          },
        ],
        fetterInfo: {
          expLevel: 10,
        },
      },
    ]
  }

  return baseResponse
}
