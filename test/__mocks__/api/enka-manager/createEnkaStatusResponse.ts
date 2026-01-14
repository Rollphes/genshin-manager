import type { APIEnkaStatus } from '@/types/enkaNetwork/EnkaStatusTypes'

/**
 * Create mock EnkaStatus API response for testing
 * @param customData Optional custom data to override defaults
 * @returns Mock APIEnkaStatus response based on real API structure
 */
export function createEnkaStatusResponse(
  customData: Partial<APIEnkaStatus> = {},
): APIEnkaStatus {
  const defaultResponse: APIEnkaStatus = {
    now: '2025-08-12T15:06',
    hsr: {
      time: {
        asia: 142,
        china: 25,
        cht: 16,
        euro: 21,
        usa: 33,
      },
      ping: {
        asia: 301,
        china: 263,
        cht: 306,
        euro: 35,
        usa: 125,
      },
      nodes: {
        asia: 6234,
        china: 3460,
        cht: 6634,
        euro: 6872,
        usa: 6605,
      },
      underruns: {
        asia: '0',
        china: '0',
        cht: '0',
        euro: '0',
        usa: '0',
      },
    },
    gi: {
      time: {
        asia: 1181,
        bilibili: 0,
        china: 183,
        cht: 5,
        euro: 286,
        usa: 275,
      },
      ping: {
        asia: 278,
        china: 231,
        cht: 333,
        euro: 44,
        usa: 144,
      },
      nodes: {
        asia: 1726,
        china: 1213,
        cht: 2462,
        euro: 2448,
        usa: 1751,
      },
      underruns: {
        asia: '0',
        china: '0',
        cht: '0',
        euro: '0',
        usa: '0',
      },
    },
    gg: {
      time: {},
      ping: {},
      nodes: {},
      underruns: {},
    },
    pingu: {
      cdn: {
        ms: 50,
        status: 200,
      },
      main: {
        ms: 75,
        status: 200,
      },
      api: {
        ms: 60,
        status: 200,
      },
      fox: {
        ms: 80,
        status: 200,
      },
    },
  }

  return { ...defaultResponse, ...customData }
}
