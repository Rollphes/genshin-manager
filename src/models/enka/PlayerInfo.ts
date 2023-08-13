import { Character } from '@/models/character/Character'
import { Costume } from '@/models/character/Costume'
import { ShowAvatarInfo } from '@/models/enka/ShowAvatarInfo'
import { Material } from '@/models/Material'
import { APIPlayerInfo } from '@/types/EnkaTypes'
export class PlayerInfo {
  readonly nickname: string
  readonly level: number
  readonly signature: string
  readonly worldLevel: number
  readonly nameCard: Material
  readonly finishAchievementNum: number
  readonly towerFloorIndex: number
  readonly towerLevelIndex: number
  readonly showAvatarInfoList: ShowAvatarInfo[]
  readonly showNameCardList: Material[]
  readonly profilePicture: Costume

  constructor(data: APIPlayerInfo) {
    this.nickname = data.nickname
    this.level = data.level
    this.signature = data.signature || ''
    this.worldLevel = data.worldLevel || 0
    this.nameCard = new Material(data.nameCardId)
    this.finishAchievementNum = data.finishAchievementNum || 0
    this.towerFloorIndex = data.towerFloorIndex || 0
    this.towerLevelIndex = data.towerLevelIndex || 0
    this.showAvatarInfoList = data.showAvatarInfoList
      ? data.showAvatarInfoList.map((v) => new ShowAvatarInfo(v))
      : []
    this.showNameCardList = data.showNameCardIdList
      ? data.showNameCardIdList.map((id) => new Material(id))
      : []
    const characterData = new Character(
      data.profilePicture?.avatarId || 10000005,
    )
    this.profilePicture = new Costume(
      data.profilePicture?.costumeId ?? characterData.defaultCostumeId,
    )
  }
}
