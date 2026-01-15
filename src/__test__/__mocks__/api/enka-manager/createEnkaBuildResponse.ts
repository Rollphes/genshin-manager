import type { APIBuild } from '@/types/enkaNetwork/EnkaAccountTypes'

/**
 * Create mock EnkaBuild API response for testing
 * @param buildId Build ID
 * @param avatarId Character avatar ID
 * @returns Mock APIBuild response
 */
export function createEnkaBuildResponse(
  buildId = 1,
  avatarId = 10000002,
): APIBuild {
  return {
    id: buildId,
    name: `Build ${String(buildId)}`,
    avatar_id: String(avatarId),
    avatar_data: {
      avatarId,
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
        20: 1500,
        21: 200,
        22: 1.2,
        23: 0.3,
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
    order: buildId,
    live: true,
    settings: {
      caption: `Description for build ${String(buildId)}`,
      artSource: 'https://example.com/art.png',
      honkardWidth: 100,
      adaptiveColor: true,
    },
    public: true,
    image: null,
    hoyo_type: 0,
  }
}
