const { Client, EnkaManager } = require('genshin-manager')

async function main() {
  const client = new Client()
  await client.deploy()

  const enkaManager = new EnkaManager()

  const enkaData = await enkaManager.fetchAll(800802278)

  const characters = enkaData.characterDetails

  if (characters.length === 0) {
    console.log(
      `This user's profile has no character set or is set to private.`,
    )
    return
  }

  characters.forEach((character) => {
    const name = character.name
    const level = character.level
    const maxLevel = character.maxLevel
    const constellation = character.constellations.length
    const stats = character.combatStatus.statProperties.map((stats) => {
      return ` - ${stats.name}: ${stats.valueText}`
    })

    const weapon = character.weapon
    const weaponName = weapon.name
    const weaponLevel = weapon.level
    const weaponMaxLevel = weapon.maxLevel
    const weaponRefinement = weapon.refinementRank
    const weaponStats = weapon.stats.map((stats) => {
      return `  - ${stats.name}: ${stats.valueText}`
    })

    console.log(
      `${name} - Lv.${level}/${maxLevel} C${constellation}\n` +
        ` - ${weaponName} - Lv.${weaponLevel}/${weaponMaxLevel} R${weaponRefinement}\n` +
        `${weaponStats.join('\n')}\n` +
        `${stats.join('\n')}`,
    )
  })
  process.exit(0)
}
void main()

/** Sample output:
Eula - Lv.90/90 C6
 - Song of Broken Pines - Lv.90/90 R5
  - Base ATK: 741
  - Physical DMG Bonus: 20.7%
 - Base HP: 13,226
 - HP: 4,780
 - HP: 8.7%
 - Base ATK: 1,083
 - ATK: 379
 - ATK: 122.3%
 - Base DEF: 751
 - DEF: 21
 - DEF: 12.4%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 66.8%
 - CRIT DMG: 178.5%
 - Energy Recharge: 100%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 44
 - Physical RES: 0%
 - Physical DMG Bonus: 129%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 0%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 19,162
 - Max HP: 19,162
 - ATK: 2,786
 - DEF: 865
 - Movement SPD: 0
Yae Miko - Lv.90/90 C6
 - Kagura's Verity - Lv.90/90 R5
  - Base ATK: 608
  - CRIT DMG: 66.2%
 - Base HP: 10,372
 - HP: 5,049
 - HP: 14.6%
 - Base ATK: 948
 - ATK: 327
 - ATK: 65.8%
 - Base DEF: 569
 - DEF: 35
 - DEF: 0%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 83.3%
 - CRIT DMG: 241.3%
 - Energy Recharge: 111.7%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 152
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 46.6%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 16,932
 - Max HP: 16,932
 - ATK: 1,898
 - DEF: 603
 - Movement SPD: 0
Hu Tao - Lv.90/90 C6
 - Staff of Homa - Lv.90/90 R5
  - Base ATK: 608
  - CRIT DMG: 66.2%
 - Base HP: 15,552
 - HP: 5,318
 - HP: 114.6%
 - Base ATK: 715
 - ATK: 311
 - ATK: 8.7%
 - Base DEF: 876
 - DEF: 19
 - DEF: 0%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 83.5%
 - CRIT DMG: 198.8%
 - Energy Recharge: 100%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 256
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 61.6%
 - Electro DMG Bonus: 0%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 11,607
 - Max HP: 42,578
 - ATK: 1,769
 - DEF: 895
 - Movement SPD: 0
Yelan - Lv.90/90 C6
 - Aqua Simulacra - Lv.90/90 R5
  - Base ATK: 542
  - CRIT DMG: 88.2%
 - Base HP: 14,450
 - HP: 5,348
 - HP: 133.6%
 - Base ATK: 786
 - ATK: 311
 - ATK: 10.5%
 - Base DEF: 548
 - DEF: 60
 - DEF: 5.1%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 75.1%
 - CRIT DMG: 281.2%
 - Energy Recharge: 100%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 0
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 0%
 - Hydro DMG Bonus: 61.6%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 22,640
 - Max HP: 45,312
 - ATK: 1,179
 - DEF: 636
 - Movement SPD: 0
Furina - Lv.90/90 C6
 - Splendor of Tranquil Waters - Lv.90/90 R5
  - Base ATK: 542
  - CRIT DMG: 88.2%
 - Base HP: 15,307
 - HP: 4,780
 - HP: 103.1%
 - Base ATK: 786
 - ATK: 360
 - ATK: 4.1%
 - Base DEF: 696
 - DEF: 56
 - DEF: 0%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 76.3%
 - CRIT DMG: 286.7%
 - Energy Recharge: 104.5%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 44
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 0%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 19,806
 - Max HP: 39,698
 - ATK: 1,177
 - DEF: 751
 - Movement SPD: 0
Kamisato Ayaka - Lv.90/90 C6
 - Mistsplitter Reforged - Lv.90/90 R5
  - Base ATK: 674
  - CRIT DMG: 44.1%
 - Base HP: 12,858
 - HP: 4,780
 - HP: 22.2%
 - Base ATK: 1,016
 - ATK: 358
 - ATK: 83.8%
 - Base DEF: 784
 - DEF: 0
 - DEF: 12.4%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 91.7%
 - CRIT DMG: 213.3%
 - Energy Recharge: 105.8%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 0
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 39%
 - Electro DMG Bonus: 24%
 - Hydro DMG Bonus: 24%
 - Dendro DMG Bonus: 24%
 - Anemo DMG Bonus: 24%
 - Geo DMG Bonus: 24%
 - Cryo DMG Bonus: 70.6%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 20,488
 - Max HP: 20,488
 - ATK: 2,226
 - DEF: 881
 - Movement SPD: 0
Raiden Shogun - Lv.90/90 C6
 - Engulfing Lightning - Lv.90/90 R5
  - Base ATK: 608
  - Energy Recharge: 55.1%
 - Base HP: 12,907
 - HP: 5,587
 - HP: 0%
 - Base ATK: 945
 - ATK: 360
 - ATK: 14.6%
 - Base DEF: 789
 - DEF: 21
 - DEF: 0%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 81.6%
 - CRIT DMG: 136.2%
 - Energy Recharge: 276.4%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 65
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 117.2%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 0%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 18,494
 - Max HP: 18,494
 - ATK: 2,377
 - DEF: 810
 - Movement SPD: 0
Nahida - Lv.90/90 C6
 - A Thousand Floating Dreams - Lv.90/90 R5
  - Base ATK: 542
  - Elemental Mastery: 265
 - Base HP: 10,360
 - HP: 5,348
 - HP: 0%
 - Base ATK: 841
 - ATK: 325
 - ATK: 40.8%
 - Base DEF: 630
 - DEF: 23
 - DEF: 0%
 - Movement SPD: 0
 - Movement SPD: 0%
 - CRIT Rate: 67.6%
 - CRIT DMG: 153.3%
 - Energy Recharge: 104.5%
 - Healing Bonus: 0%
 - Incoming Healing Bonus: 0%
 - Elemental Mastery: 625
 - Physical RES: 0%
 - Physical DMG Bonus: 0%
 - Pyro DMG Bonus: 0%
 - Electro DMG Bonus: 0%
 - Hydro DMG Bonus: 0%
 - Dendro DMG Bonus: 61.6%
 - Anemo DMG Bonus: 0%
 - Geo DMG Bonus: 0%
 - Cryo DMG Bonus: 0%
 - Pyro RES: 0%
 - Electro RES: 0%
 - Hydro RES: 0%
 - Dendro RES: 0%
 - Anemo RES: 0%
 - Geo RES: 0%
 - Cryo RES: 0%
 - CD Reduction: 0%
 - Shield Strength: 0%
 - HP: 15,708
 - Max HP: 15,708
 - ATK: 1,508
 - DEF: 653
 - Movement SPD: 0
 */
