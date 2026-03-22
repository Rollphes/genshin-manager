/**
 *
 */
export interface paths {
  /**
   *
   */
  '/api/uid/{uid}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get player data by UID */
    get: operations['getPlayerData']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/api/profile/{username}': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Enka account profile */
    get: operations['getProfile']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/api/profile/{username}/hoyos': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get linked Genshin accounts */
    get: operations['getHoyos']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/api/profile/{username}/hoyos/{hash}/builds': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get saved character builds */
    get: operations['getBuilds']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
/**
 *
 */
export type webhooks = Record<string, never>
/**
 *
 */
export interface components {
  /**
   *
   */
  schemas: {
    /**
     *
     */
    EnkaData: {
      playerInfo: components['schemas']['PlayerInfo']
      avatarInfoList?: components['schemas']['AvatarInfo'][]
      owner?: components['schemas']['Owner']
      ttl?: number
      uid: number
    }
    PlayerInfo: {
      nickname?: string
      level: number
      signature?: string
      worldLevel?: number
      nameCardId: number
      finishAchievementNum?: number
      towerFloorIndex?: number
      towerLevelIndex?: number
      towerStarIndex?: number
      showAvatarInfoList?: components['schemas']['ShowAvatarInfo'][]
      showNameCardIdList?: number[]
      profilePicture?: components['schemas']['ProfilePicture']
      isShowAvatarTalent?: boolean
      fetterCount?: number
      theaterActIndex?: number
      theaterModeIndex?: number
      theaterStarIndex?: number
    }
    ShowAvatarInfo: {
      avatarId: number
      level: number
      costumeId?: number
      energyType?: number
      talentLevel?: number
    }
    /**
     *
     */
    ProfilePicture: {
      avatarId?: number
      id?: number
      costumeId?: number
    }
    /**
     *
     */
    AvatarInfo: {
      avatarId: number
      costumeId?: number
      propMap: Record<string, components['schemas']['PropMap']>
      talentIdList?: number[]
      /**
       *
       */
      fightPropMap: Record<string, number>
      skillDepotId: number
      skillLevelMap: Record<string, number>
      /**
       *
       */
      proudSkillExtraLevelMap?: Record<string, number>
      equipList: (
        | components['schemas']['ReliquaryEquip']
        | components['schemas']['WeaponEquip']
      )[]
      /**
       *
       */
      fetterInfo: {
        expLevel: number
      }
    }
    /**
     *
     */
    PropMap: {
      val?: string
    }
    ReliquaryEquip: {
      itemId: number
      reliquary: components['schemas']['Reliquary']
    }
    /**
     *
     */
    WeaponEquip: {
      itemId: number
      weapon: components['schemas']['Weapon']
    }
    /**
     *
     */
    Reliquary: {
      level: number
      mainPropId: number
      appendPropIdList?: number[]
    }
    /**
     *
     */
    Weapon: {
      level: number
      promoteLevel?: number
      affixMap?: Record<string, number>
    }
    Owner: {
      hash?: string
      username: string
      profile: components['schemas']['Profile']
      id: number
    }
    /**
     *
     */
    Profile: {
      bio: string
      level: number
      signup_state: number
      avatar?: string | null
      image_url: string
    }
    /**
     *
     */
    GameAccount: {
      uid: number
      uid_public: boolean
      public: boolean
      live_public: boolean
      verified: boolean
      player_info: components['schemas']['PlayerInfo']
      hash: string
      region: string
      order: number
      avatar_order: Record<string, number>
      hoyo_type: number
    }
    /**
     *
     */
    Build: {
      id: number
      name: string
      avatar_id: string
      avatar_data: components['schemas']['AvatarInfo']
      order: number
      live: boolean
      settings: components['schemas']['BuildSettings']
      public: boolean
      image?: string | null
      hoyo_type: number
    }
    BuildSettings: {
      caption?: string
      artSource?: string
      honkardWidth?: number
      adaptiveColor?: boolean
    }
    ErrorResponse: {
      message?: string
      error?: string
    }
  }
  /**
   *
   */
  responses: never
  /**
   *
   */
  parameters: never
  /**
   *
   */
  requestBodies: never
  /**
   *
   */
  headers: never
  /**
   *
   */
  pathItems: never
}
/**
 *
 */
export type $defs = Record<string, never>
/**
 *
 */
export interface operations {
  /**
   *
   */
  getPlayerData: {
    parameters: {
      /**
       *
       */
      query?: {
        /** @description If true, returns only player info without character details */
        info?: boolean
      }
      header?: never
      path: {
        /** @description Genshin Impact UID */
        uid: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Player data */
      200: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['EnkaData']
        }
      }
      /** @description Invalid UID */
      400: {
        /**
         *
         */
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Player not found */
      404: {
        /**
         *
         */
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Game maintenance */
      424: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Rate limit exceeded */
      429: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Server error */
      500: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Service unavailable */
      503: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Error response */
      default: {
        /**
         *
         */
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  /**
   *
   */
  getProfile: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Enka account username */
        username: string
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description Account profile */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['Owner']
        }
      }
      /** @description User not found */
      404: {
        /**
         *
         */
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  /**
   *
   */
  getHoyos: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Enka account username */
        username: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Linked game accounts */
      200: {
        /**
         *
         */
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': Record<
            string,
            components['schemas']['GameAccount']
          >
        }
      }
      /** @description User not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  /**
   *
   */
  getBuilds: {
    parameters: {
      query?: never
      header?: never
      /**
       *
       */
      path: {
        /** @description Enka account username */
        username: string
        /** @description Game account hash */
        hash: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Character builds */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['Build'][]
        }
      }
      /** @description Account not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
}
