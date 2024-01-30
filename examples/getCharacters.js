const {
  Client,
  CharacterInfo,
  CharacterProfile,
  CharacterCostume,
  CharacterBaseStats,
} = require('genshin-manager')

async function main() {
  const client = new Client()
  await client.deploy()

  CharacterInfo.allCharacterIds.forEach((characterId) => {
    const level = 90
    const isAscended = true

    const characterInfo = new CharacterInfo(characterId)
    const profile = new CharacterProfile(characterId)
    const costume = new CharacterCostume(characterInfo.defaultCostumeId)
    const stats = new CharacterBaseStats(
      characterId,
      level,
      isAscended,
    ).stats.map((stats) => {
      return ` - ${stats.name}: ${stats.valueText}`
    })

    const birthDateString = profile.birthDate
      ? profile.birthDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
        })
      : '???'

    console.log(characterInfo.name)
    console.log(`- Rarity: ${characterInfo.rarity}`)
    console.log(`- Element: ${characterInfo.element}`)
    console.log(`- WeaponType: ${characterInfo.weaponType}`)
    console.log(`- Affiliation: ${profile.native}`)
    console.log(`- Constellation: ${profile.constellation}`)
    console.log(`- Birthday: ${birthDateString}`)
    console.log(`- CV: ${profile.cv.EN}`)
    console.log(`- Base Stats (LV.90)`)
    console.log(stats.join('\n'))
    console.log(`- Icon URL: ${costume.icon.url}`)
  })

  process.exit(0)
}
void main()

/** Sample output:
Kamisato Ayaka
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Yashiro Commission
- Constellation: Grus Nivis
- Birthday: 09/28
- CV: Erica Mendez
- Base Stats (LV.90)
 - Base HP: 12,858
 - Base ATK: 342
 - Base DEF: 784
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Ayaka.png
Jean
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Knights of Favonius
- Constellation: Leo Minor
- Birthday: 03/14
- CV: Stephanie Southerland
- Base Stats (LV.90)
 - Base HP: 14,695
 - Base ATK: 239
 - Base DEF: 769
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Healing Bonus: 22.1%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Qin.png
Traveler
- Rarity: 5
- Element: undefined
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: -
- Constellation: Viator
- Birthday: ???
- CV: Zach Aguilar & Corina Boettger
- Base Stats (LV.90)
 - Base HP: 10,875
 - Base ATK: 212
 - Base DEF: 683
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_PlayerBoy.png
Lisa
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_CATALYST
- Affiliation: Knights of Favonius
- Constellation: Tempus Fugit
- Birthday: 06/09
- CV: Mara Junot
- Base Stats (LV.90)
 - Base HP: 9,570
 - Base ATK: 232
 - Base DEF: 573
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 96
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Lisa.png
Traveler
- Rarity: 5
- Element: undefined
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: -
- Constellation: Viatrix
- Birthday: ???
- CV: Sarah Miller-Crews & Corina Boettger
- Base Stats (LV.90)
 - Base HP: 10,875
 - Base ATK: 212
 - Base DEF: 683
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_PlayerGirl.png
Barbara
- Rarity: 4
- Element: Hydro
- WeaponType: WEAPON_CATALYST
- Affiliation: Church of Favonius
- Constellation: Crater
- Birthday: 07/05
- CV: Laura Stahl
- Base Stats (LV.90)
 - Base HP: 9,787
 - Base ATK: 159
 - Base DEF: 669
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Barbara.png
Kaeya
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Knights of Favonius
- Constellation: Pavo Ocellus
- Birthday: 11/30
- CV: Josey Montana McCoy
- Base Stats (LV.90)
 - Base HP: 11,636
 - Base ATK: 223
 - Base DEF: 792
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 26.7%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Kaeya.png
Diluc
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Dawn Winery
- Constellation: Noctua
- Birthday: 04/30
- CV: Sean Chiplock
- Base Stats (LV.90)
 - Base HP: 12,981
 - Base ATK: 335
 - Base DEF: 784
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Diluc.png
Razor
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Wolvendom
- Constellation: Lupus Minor
- Birthday: 09/09
- CV: Todd Haberkorn
- Base Stats (LV.90)
 - Base HP: 11,962
 - Base ATK: 234
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Physical DMG Bonus: 30%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Razor.png
Amber
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_BOW
- Affiliation: Knights of Favonius
- Constellation: Lepus
- Birthday: 08/10
- CV: Kelly Baskin
- Base Stats (LV.90)
 - Base HP: 9,461
 - Base ATK: 223
 - Base DEF: 601
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Ambor.png
Venti
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_BOW
- Affiliation: Mondstadt
- Constellation: Carmen Dei
- Birthday: 06/16
- CV: Erika Harlacher
- Base Stats (LV.90)
 - Base HP: 10,531
 - Base ATK: 263
 - Base DEF: 669
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 32%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Venti.png
Xiangling
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_POLE
- Affiliation: Wanmin Restaurant
- Constellation: Trulla
- Birthday: 11/02
- CV: Jackie Lastra
- Base Stats (LV.90)
 - Base HP: 10,875
 - Base ATK: 225
 - Base DEF: 669
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 96
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Xiangling.png
Beidou
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: The Crux
- Constellation: Victor Mare
- Birthday: 02/14
- CV: Allegra Clark
- Base Stats (LV.90)
 - Base HP: 13,050
 - Base ATK: 225
 - Base DEF: 648
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Electro DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Beidou.png
Xingqiu
- Rarity: 4
- Element: Hydro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Feiyun Commerce Guild
- Constellation: Fabulae Textile
- Birthday: 10/09
- CV: Cristina Vee Valenzuela
- Base Stats (LV.90)
 - Base HP: 10,222
 - Base ATK: 202
 - Base DEF: 758
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Xingqiu.png
Xiao
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_POLE
- Affiliation: Liyue Adeptus
- Constellation: Alatus Nemeseos
- Birthday: 04/17
- CV: Laila Berzins
- Base Stats (LV.90)
 - Base HP: 12,736
 - Base ATK: 349
 - Base DEF: 799
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Xiao.png
Ningguang
- Rarity: 4
- Element: Geo
- WeaponType: WEAPON_CATALYST
- Affiliation: Liyue Qixing
- Constellation: Opus Aequilibrium
- Birthday: 08/26
- CV: Erin Ebers
- Base Stats (LV.90)
 - Base HP: 9,787
 - Base ATK: 212
 - Base DEF: 573
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Geo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Ningguang.png
Klee
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_CATALYST
- Affiliation: Knights of Favonius
- Constellation: Trifolium
- Birthday: 07/27
- CV: Poonam Basu
- Base Stats (LV.90)
 - Base HP: 10,287
 - Base ATK: 311
 - Base DEF: 615
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Pyro DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Klee.png
Zhongli
- Rarity: 5
- Element: Geo
- WeaponType: WEAPON_POLE
- Affiliation: Liyue Harbor
- Constellation: Lapis Dei
- Birthday: 12/31
- CV: Keith Silverstein
- Base Stats (LV.90)
 - Base HP: 14,695
 - Base ATK: 251
 - Base DEF: 738
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Geo DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Zhongli.png
Fischl
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_BOW
- Affiliation: Adventurers' Guild
- Constellation: Corvus
- Birthday: 05/27
- CV: Brittany Cox & Ben Pronsky
- Base Stats (LV.90)
 - Base HP: 9,189
 - Base ATK: 244
 - Base DEF: 594
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Fischl.png
Bennett
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Adventurers' Guild
- Constellation: Rota Calamitas
- Birthday: 03/01
- CV: Cristina Vee Valenzuela
- Base Stats (LV.90)
 - Base HP: 12,397
 - Base ATK: 191
 - Base DEF: 771
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 26.7%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Bennett.png
Tartaglia
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_BOW
- Affiliation: Fatui
- Constellation: Monoceros Caeli
- Birthday: 07/20
- CV: Griffin Burns
- Base Stats (LV.90)
 - Base HP: 13,103
 - Base ATK: 301
 - Base DEF: 815
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Hydro DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Tartaglia.png
Noelle
- Rarity: 4
- Element: Geo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Knights of Favonius
- Constellation: Parma Cordis
- Birthday: 03/21
- CV: Laura Faye Smith
- Base Stats (LV.90)
 - Base HP: 12,071
 - Base ATK: 191
 - Base DEF: 799
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - DEF: 30%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Noel.png
Qiqi
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Bubu Pharmacy
- Constellation: Pristina Nola
- Birthday: 03/03
- CV: Christie Cate
- Base Stats (LV.90)
 - Base HP: 12,368
 - Base ATK: 287
 - Base DEF: 922
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Healing Bonus: 22.1%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Qiqi.png
Chongyun
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Tianheng Thaumaturges
- Constellation: Nubis Caesor
- Birthday: 09/07
- CV: Beau Bridgland
- Base Stats (LV.90)
 - Base HP: 10,984
 - Base ATK: 223
 - Base DEF: 648
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Chongyun.png
Ganyu
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_BOW
- Affiliation: Yuehai Pavilion
- Constellation: Sinae Unicornis
- Birthday: 12/02
- CV: Jennifer Losi
- Base Stats (LV.90)
 - Base HP: 9,797
 - Base ATK: 335
 - Base DEF: 630
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Ganyu.png
Albedo
- Rarity: 5
- Element: Geo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Knights of Favonius
- Constellation: Princeps Cretaceus
- Birthday: 09/13
- CV: Khoi Dao
- Base Stats (LV.90)
 - Base HP: 13,226
 - Base ATK: 251
 - Base DEF: 876
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Geo DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Albedo.png
Diona
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_BOW
- Affiliation: The Cat's Tail
- Constellation: Feles
- Birthday: 01/18
- CV: Dina Sherman
- Base Stats (LV.90)
 - Base HP: 9,570
 - Base ATK: 212
 - Base DEF: 601
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Cryo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Diona.png
Mona
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_CATALYST
- Affiliation: Mondstadt
- Constellation: Astrolabos
- Birthday: 08/31
- CV: Felecia Angelle
- Base Stats (LV.90)
 - Base HP: 10,409
 - Base ATK: 287
 - Base DEF: 653
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 32%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Mona.png
Keqing
- Rarity: 5
- Element: Electro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Liyue Qixing
- Constellation: Trulla Cementarii
- Birthday: 11/20
- CV: Kayli Mills
- Base Stats (LV.90)
 - Base HP: 13,103
 - Base ATK: 323
 - Base DEF: 799
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Keqing.png
Sucrose
- Rarity: 4
- Element: Anemo
- WeaponType: WEAPON_CATALYST
- Affiliation: Knights of Favonius
- Constellation: Ampulla
- Birthday: 11/26
- CV: Valeria Rodriguez
- Base Stats (LV.90)
 - Base HP: 9,244
 - Base ATK: 170
 - Base DEF: 703
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Anemo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Sucrose.png
Xinyan
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: \"The Red Strings\"
- Constellation: Fila Ignium
- Birthday: 10/16
- CV: Laura Stahl
- Base Stats (LV.90)
 - Base HP: 11,201
 - Base ATK: 249
 - Base DEF: 799
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Xinyan.png
Rosaria
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_POLE
- Affiliation: Church of Favonius
- Constellation: Spinea Corona
- Birthday: 01/24
- CV: Elizabeth Maxwell
- Base Stats (LV.90)
 - Base HP: 12,289
 - Base ATK: 240
 - Base DEF: 710
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Rosaria.png
Hu Tao
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_POLE
- Affiliation: Wangsheng Funeral Parlor
- Constellation: Papilio Charontis
- Birthday: 07/15
- CV: Brianna Knickerbocker
- Base Stats (LV.90)
 - Base HP: 15,552
 - Base ATK: 106
 - Base DEF: 876
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Hutao.png
Kaedehara Kazuha
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: The Crux
- Constellation: Acer Palmatum
- Birthday: 10/29
- CV: Mark Whitten
- Base Stats (LV.90)
 - Base HP: 13,348
 - Base ATK: 297
 - Base DEF: 807
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 115
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Kazuha.png
Yanfei
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_CATALYST
- Affiliation: Yanfei Legal Consultancy
- Constellation: Bestia Iustitia
- Birthday: 07/28
- CV: Lizzie Freeman
- Base Stats (LV.90)
 - Base HP: 9,352
 - Base ATK: 240
 - Base DEF: 587
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Pyro DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Feiyan.png
Yoimiya
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_BOW
- Affiliation: Naganohara Fireworks
- Constellation: Carassius Auratus
- Birthday: 06/21
- CV: Jenny Yokobori
- Base Stats (LV.90)
 - Base HP: 10,164
 - Base ATK: 323
 - Base DEF: 615
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Yoimiya.png
Thoma
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_POLE
- Affiliation: Yashiro Commission
- Constellation: Rubeum Scutum
- Birthday: 01/09
- CV: Christian Banas
- Base Stats (LV.90)
 - Base HP: 10,331
 - Base ATK: 202
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Tohma.png
Eula
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Knights of Favonius
- Constellation: Aphros Delos
- Birthday: 10/25
- CV: Suzie Yeung
- Base Stats (LV.90)
 - Base HP: 13,226
 - Base ATK: 342
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Eula.png
Raiden Shogun
- Rarity: 5
- Element: Electro
- WeaponType: WEAPON_POLE
- Affiliation: Inazuma City
- Constellation: Imperatrix Umbrosa
- Birthday: 06/26
- CV: Anne Yatco
- Base Stats (LV.90)
 - Base HP: 12,907
 - Base ATK: 337
 - Base DEF: 789
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 32%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Shougun.png
Sayu
- Rarity: 4
- Element: Anemo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Shuumatsuban
- Constellation: Nyctereutes Minor
- Birthday: 10/19
- CV: Lilypichu (Lily Ki)
- Base Stats (LV.90)
 - Base HP: 11,854
 - Base ATK: 244
 - Base DEF: 745
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 96
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Sayu.png
Sangonomiya Kokomi
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_CATALYST
- Affiliation: Watatsumi Island
- Constellation: Dracaena Somnolenta
- Birthday: 02/22
- CV: Risa Mei
- Base Stats (LV.90)
 - Base HP: 13,471
 - Base ATK: 234
 - Base DEF: 657
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Hydro DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Kokomi.png
Gorou
- Rarity: 4
- Element: Geo
- WeaponType: WEAPON_BOW
- Affiliation: Watatsumi Island
- Constellation: Canis Bellatoris
- Birthday: 05/18
- CV: Cory Yee
- Base Stats (LV.90)
 - Base HP: 9,570
 - Base ATK: 183
 - Base DEF: 648
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Geo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Gorou.png
Kujou Sara
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_BOW
- Affiliation: Tenryou Commission
- Constellation: Flabellum
- Birthday: 07/14
- CV: Jeannie Tirado
- Base Stats (LV.90)
 - Base HP: 9,570
 - Base ATK: 195
 - Base DEF: 628
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Sara.png
Arataki Itto
- Rarity: 5
- Element: Geo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Arataki Gang
- Constellation: Taurus Iracundus
- Birthday: 06/01
- CV: Max Mittelman
- Base Stats (LV.90)
 - Base HP: 12,858
 - Base ATK: 227
 - Base DEF: 959
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Itto.png
Yae Miko
- Rarity: 5
- Element: Electro
- WeaponType: WEAPON_CATALYST
- Affiliation: Grand Narukami Shrine
- Constellation: Divina Vulpes
- Birthday: 06/27
- CV: Ratana
- Base Stats (LV.90)
 - Base HP: 10,372
 - Base ATK: 340
 - Base DEF: 569
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Yae.png
Shikanoin Heizou
- Rarity: 4
- Element: Anemo
- WeaponType: WEAPON_CATALYST
- Affiliation: Tenryou Commission
- Constellation: Cervus Minor
- Birthday: 07/24
- CV: Kieran Regan
- Base Stats (LV.90)
 - Base HP: 10,657
 - Base ATK: 225
 - Base DEF: 684
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Anemo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Heizo.png
Yelan
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_BOW
- Affiliation: Yanshang Teahouse
- Constellation: Umbrabilis Orchis
- Birthday: 04/20
- CV: Laura Post
- Base Stats (LV.90)
 - Base HP: 14,450
 - Base ATK: 244
 - Base DEF: 548
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Yelan.png
Kirara
- Rarity: 4
- Element: Dendro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Komaniya Express
- Constellation: Arcella
- Birthday: 01/22
- CV: Julia Gu
- Base Stats (LV.90)
 - Base HP: 12,180
 - Base ATK: 223
 - Base DEF: 546
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Momoka.png
Aloy
- Rarity: 0
- Element: Cryo
- WeaponType: WEAPON_BOW
- Affiliation: Wandering Heroine
- Constellation: Nora Fortis
- Birthday: 04/04
- CV: —
- Base Stats (LV.90)
 - Base HP: 10,899
 - Base ATK: 234
 - Base DEF: 676
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Cryo DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Aloy.png
Shenhe
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_POLE
- Affiliation: Cloud Retainer's Abode
- Constellation: Crista Doloris
- Birthday: 03/10
- CV: Chelsea Kwoka
- Base Stats (LV.90)
 - Base HP: 12,993
 - Base ATK: 304
 - Base DEF: 830
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Shenhe.png
Yun Jin
- Rarity: 4
- Element: Geo
- WeaponType: WEAPON_POLE
- Affiliation: Yun-Han Opera Troupe
- Constellation: Opera Grandis
- Birthday: 05/21
- CV: Judy Alice Lee & Yang Yang
- Base Stats (LV.90)
 - Base HP: 10,657
 - Base ATK: 191
 - Base DEF: 734
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Energy Recharge: 26.7%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Yunjin.png
Kuki Shinobu
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Arataki Gang
- Constellation: Tribulatio Demptio
- Birthday: 07/27
- CV: Kira Buckland
- Base Stats (LV.90)
 - Base HP: 12,289
 - Base ATK: 212
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Shinobu.png
Kamisato Ayato
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Yashiro Commission
- Constellation: Cypressus Custos
- Birthday: 03/26
- CV: Chris Hackney
- Base Stats (LV.90)
 - Base HP: 13,715
 - Base ATK: 299
 - Base DEF: 769
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Ayato.png
Collei
- Rarity: 4
- Element: Dendro
- WeaponType: WEAPON_BOW
- Affiliation: Gandharva Ville
- Constellation: Leptailurus Cervarius
- Birthday: 05/08
- CV: Christina Costello
- Base Stats (LV.90)
 - Base HP: 9,787
 - Base ATK: 200
 - Base DEF: 601
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Collei.png
Dori
- Rarity: 4
- Element: Electro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: The Palace of Alcazarzaray
- Constellation: Magicae Lucerna
- Birthday: 12/21
- CV: Anjali Kunapaneni
- Base Stats (LV.90)
 - Base HP: 12,397
 - Base ATK: 223
 - Base DEF: 723
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Dori.png
Tighnari
- Rarity: 5
- Element: Dendro
- WeaponType: WEAPON_BOW
- Affiliation: Gandharva Ville
- Constellation: Vulpes Zerda
- Birthday: 12/29
- CV: Zachary Gordon
- Base Stats (LV.90)
 - Base HP: 10,850
 - Base ATK: 268
 - Base DEF: 630
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Dendro DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Tighnari.png
Nilou
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Zubayr Theater
- Constellation: Lotos Somno
- Birthday: 12/03
- CV: Dani Chambers
- Base Stats (LV.90)
 - Base HP: 15,185
 - Base ATK: 230
 - Base DEF: 729
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Nilou.png
Cyno
- Rarity: 5
- Element: Electro
- WeaponType: WEAPON_POLE
- Affiliation: Temple of Silence
- Constellation: Lupus Aureus
- Birthday: 06/23
- CV: Alejandro Saab
- Base Stats (LV.90)
 - Base HP: 12,491
 - Base ATK: 318
 - Base DEF: 859
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Cyno.png
Candace
- Rarity: 4
- Element: Hydro
- WeaponType: WEAPON_POLE
- Affiliation: Aaru Village
- Constellation: Sagitta Scutum
- Birthday: 05/03
- CV: Shara Kirby
- Base Stats (LV.90)
 - Base HP: 10,875
 - Base ATK: 212
 - Base DEF: 683
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Candace.png
Nahida
- Rarity: 5
- Element: Dendro
- WeaponType: WEAPON_CATALYST
- Affiliation: Sumeru City
- Constellation: Sapientia Oromasdis
- Birthday: 10/27
- CV: Kimberley Anne Campbell
- Base Stats (LV.90)
 - Base HP: 10,360
 - Base ATK: 299
 - Base DEF: 630
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 115
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Nahida.png
Layla
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Rtawahist
- Constellation: Luscinia
- Birthday: 12/19
- CV: Ashely Biski
- Base Stats (LV.90)
 - Base HP: 11,092
 - Base ATK: 217
 - Base DEF: 655
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Layla.png
Wanderer
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_CATALYST
- Affiliation: None
- Constellation: Peregrinus
- Birthday: 01/03
- CV: Patrick Pedraza
- Base Stats (LV.90)
 - Base HP: 10,164
 - Base ATK: 328
 - Base DEF: 607
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Wanderer.png
Faruzan
- Rarity: 4
- Element: Anemo
- WeaponType: WEAPON_BOW
- Affiliation: Haravatat
- Constellation: Flosculi Implexi
- Birthday: 08/20
- CV: Chandni Parekh
- Base Stats (LV.90)
 - Base HP: 9,570
 - Base ATK: 196
 - Base DEF: 628
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Faruzan.png
Yaoyao
- Rarity: 4
- Element: Dendro
- WeaponType: WEAPON_POLE
- Affiliation: Streetward Rambler's Abode
- Constellation: Osmanthus
- Birthday: 03/06
- CV: Kelsey Jaffer
- Base Stats (LV.90)
 - Base HP: 12,289
 - Base ATK: 212
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Yaoyao.png
Alhaitham
- Rarity: 5
- Element: Dendro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Sumeru Akademiya
- Constellation: Vultur Volans
- Birthday: 02/11
- CV: Nazeeh Tarsha
- Base Stats (LV.90)
 - Base HP: 13,348
 - Base ATK: 313
 - Base DEF: 782
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Dendro DMG Bonus: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Alhatham.png
Dehya
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: The Eremites
- Constellation: Mantichora
- Birthday: 04/07
- CV: Amber May
- Base Stats (LV.90)
 - Base HP: 15,675
 - Base ATK: 265
 - Base DEF: 628
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Dehya.png
Mika
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_POLE
- Affiliation: Knights of Favonius
- Constellation: Palumbus
- Birthday: 08/11
- CV: Robb Moreira
- Base Stats (LV.90)
 - Base HP: 12,506
 - Base ATK: 223
 - Base DEF: 713
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Mika.png
Kaveh
- Rarity: 4
- Element: Dendro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Independent Design Studio
- Constellation: Paradisaea
- Birthday: 07/09
- CV: Ben Balmaceda
- Base Stats (LV.90)
 - Base HP: 11,962
 - Base ATK: 234
 - Base DEF: 751
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Elemental Mastery: 96
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Kaveh.png
Baizhu
- Rarity: 5
- Element: Dendro
- WeaponType: WEAPON_CATALYST
- Affiliation: Bubu Pharmacy
- Constellation: Lagenaria
- Birthday: 04/25
- CV: Sean Durrie & Xanthe Huynh
- Base Stats (LV.90)
 - Base HP: 13,348
 - Base ATK: 193
 - Base DEF: 500
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Baizhuer.png
Lynette
- Rarity: 4
- Element: Anemo
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Hotel Bouffes d'ete
- Constellation: Felis Alba
- Birthday: 02/02
- CV: Anairis Quiñones
- Base Stats (LV.90)
 - Base HP: 12,397
 - Base ATK: 232
 - Base DEF: 712
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - Anemo DMG Bonus: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Linette.png
Lyney
- Rarity: 5
- Element: Pyro
- WeaponType: WEAPON_BOW
- Affiliation: Hotel Bouffes d'ete
- Constellation: Felis Fuscus
- Birthday: 02/02
- CV: Daman Mills
- Base Stats (LV.90)
 - Base HP: 11,021
 - Base ATK: 318
 - Base DEF: 538
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Liney.png
Freminet
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Hotel Bouffes d'ete
- Constellation: Automaton
- Birthday: 09/24
- CV: Paul Castro Jr.
- Base Stats (LV.90)
 - Base HP: 12,071
 - Base ATK: 255
 - Base DEF: 708
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Freminet.png
Wriothesley
- Rarity: 5
- Element: Cryo
- WeaponType: WEAPON_CATALYST
- Affiliation: Fortress of Meropide
- Constellation: Cerberus
- Birthday: 11/23
- CV: Joe Zieja
- Base Stats (LV.90)
 - Base HP: 13,593
 - Base ATK: 311
 - Base DEF: 763
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Wriothesley.png
Neuvillette
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_CATALYST
- Affiliation: Court of Fontaine
- Constellation: Leviathan Judicator
- Birthday: 12/18
- CV: Ray Chase
- Base Stats (LV.90)
 - Base HP: 14,695
 - Base ATK: 208
 - Base DEF: 576
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Neuvillette.png
Charlotte
- Rarity: 4
- Element: Cryo
- WeaponType: WEAPON_CATALYST
- Affiliation: The Steambird
- Constellation: Hualina Veritas
- Birthday: 04/10
- CV: Maya Aoki Tuttle
- Base Stats (LV.90)
 - Base HP: 10,766
 - Base ATK: 173
 - Base DEF: 546
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Charlotte.png
Furina
- Rarity: 5
- Element: Hydro
- WeaponType: WEAPON_SWORD_ONE_HAND
- Affiliation: Court of Fontaine
- Constellation: Animula Choragi
- Birthday: 10/13
- CV: Amber Lee Connors
- Base Stats (LV.90)
 - Base HP: 15,307
 - Base ATK: 244
 - Base DEF: 696
 - CRIT Rate: 24.2%
 - CRIT DMG: 50%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Furina.png
Chevreuse
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_POLE
- Affiliation: Special Security and Surveillance Patrol
- Constellation: Sclopetum Ensiferum
- Birthday: 01/10
- CV: Erica Lindbeck
- Base Stats (LV.90)
 - Base HP: 11,962
 - Base ATK: 193
 - Base DEF: 605
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - HP: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Chevreuse.png
Navia
- Rarity: 5
- Element: Geo
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Spina di Rosula
- Constellation: Rosa Multiflora
- Birthday: 08/16
- CV: Brenna Larsen
- Base Stats (LV.90)
 - Base HP: 12,650
 - Base ATK: 352
 - Base DEF: 793
 - CRIT Rate: 5%
 - CRIT DMG: 88.4%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Navia.png
Gaming
- Rarity: 4
- Element: Pyro
- WeaponType: WEAPON_CLAYMORE
- Affiliation: Sword and Strongbox Secure Transport Agency
- Constellation: Leo Expergiscens
- Birthday: 12/22
- CV: Caleb Yen
- Base Stats (LV.90)
 - Base HP: 11,419
 - Base ATK: 302
 - Base DEF: 703
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 24%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Gaming.png
Xianyun
- Rarity: 5
- Element: Anemo
- WeaponType: WEAPON_CATALYST
- Affiliation: Mt. Aocang
- Constellation: Grus Serena
- Birthday: 04/11
- CV: Stephanie Panisello
- Base Stats (LV.90)
 - Base HP: 10,409
 - Base ATK: 335
 - Base DEF: 573
 - CRIT Rate: 5%
 - CRIT DMG: 50%
 - ATK: 28.8%
- Icon URL: https://api.ambr.top/assets/UI/UI_AvatarIcon_Liuyun.png
*/
