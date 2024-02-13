const {
  Client,
  Weapon,
  WeaponAscension,
  WeaponRefinement,
} = require('genshin-manager')

async function main() {
  const client = new Client()
  await client.deploy()
  Weapon.allWeaponIds.forEach((weaponId) => {
    const maxPromoteLevel =
      WeaponAscension.getMaxPromoteLevelByWeaponId(weaponId)
    const maxLevel = new WeaponAscension(weaponId, maxPromoteLevel)
      .unlockMaxLevel
    const maxRefinementRank =
      WeaponRefinement.getMaxRefinementRankByWeaponId(weaponId)
    const isAscended = true

    const weapon = new Weapon(weaponId, maxLevel, isAscended, maxRefinementRank)
    const stats = weapon.stats.map((stats) => {
      return ` - ${stats.name}: ${stats.valueText}`
    })

    console.log(weapon.name)
    console.log(`- Description: ${weapon.description.replace(/\n/g, '\n ')}`)
    console.log(`- Rarity: ${weapon.rarity}`)
    console.log(`- WeaponType: ${weapon.type}`)
    console.log(`- Skill Name: ${weapon.skillName}`)
    console.log(
      `- Skill Description(rank:${weapon.refinementRank}): ${(weapon.skillDescription ?? '').replace(/\n/g, '\n ')}`,
    )
    console.log(`- Base Stats (LV.${weapon.level})`)
    console.log(stats.join('\n'))
    console.log(`- Icon URL: ${weapon.icon.url}`)
  })

  process.exit(0)
}
void main()

/** Sample output:
Dull Blade
- Description: Youthful dreams and the thrill of adventure. If this isn't enough, then make it up with valiance.
- Rarity: 1
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Blunt_Awaken.png
Silver Sword
- Description: A sword for exorcising demons. Everyone knows it's made of a silver alloy, not pure silver.
- Rarity: 2
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 243
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Silver_Awaken.png
Cool Steel
- Description: A reliable steel-forged weapon that serves as a testament to the great adventures of its old master.
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Bane of Water and Ice
- Skill Description(rank:5): Increases DMG against opponents affected by Hydro or Cryo by <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 401
 - ATK: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Steel_Awaken.png
Harbinger of Dawn
- Description: A sword that once shone like the sun. The wielder of this sword will be blessed with a \"feel-good\" buff. The reflective material on the blade has long worn off.
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Vigorous
- Skill Description(rank:5): When HP is above 90%, increases CRIT Rate by <color=#99FFFFFF>28%</color>.
- Base Stats (LV.90)
 - Base ATK: 401
 - CRIT DMG: 46.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Dawn_Awaken.png
Traveler's Handy Sword
- Description: A handy steel sword which contains scissors, a magnifying glass, tinder, and other useful items in its sheath.
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Journey
- Skill Description(rank:5): Each Elemental Orb or Particle collected restores <color=#99FFFFFF>2%</color> HP.
- Base Stats (LV.90)
 - Base ATK: 448
 - DEF: 29.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Traveler_Awaken.png
Dark Iron Sword
- Description: A perfectly ordinary iron sword, just slightly darker than most.
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Overloaded
- Skill Description(rank:5): Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by <color=#99FFFFFF>40%</color> for 12s.
- Base Stats (LV.90)
 - Base ATK: 401
 - Elemental Mastery: 141
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Darker_Awaken.png
Fillet Blade
- Description: A sharp filleting knife. The blade is long, thin, and incredibly sharp.
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Gash
- Skill Description(rank:5): On hit, has a 50% chance to deal <color=#99FFFFFF>400%</color> ATK DMG to a single target. Can only occur once every <color=#99FFFFFF>11</color>s.
- Base Stats (LV.90)
 - Base ATK: 401
 - ATK: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Sashimi_Awaken.png
Skyrider Sword
- Description: A reliable steel sword. The legendary Skyrider once tried to ride it as a flying sword...
- Rarity: 3
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Determination
- Skill Description(rank:5): Using an Elemental Burst grants a <color=#99FFFFFF>24%</color> increase in ATK and Movement SPD for 15s.
- Base Stats (LV.90)
 - Base ATK: 354
 - Energy Recharge: 52.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Mitsurugi_Awaken.png
Favonius Sword
- Description: A standard-issue longsword of the Knights of Favonius. When you're armed with this agile and sharp weapon, channeling the power of the elements has never been so easy!
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Windfall
- Skill Description(rank:5): CRIT Hits have a <color=#99FFFFFF>100%</color> chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every <color=#99FFFFFF>6</color>s.
- Base Stats (LV.90)
 - Base ATK: 454
 - Energy Recharge: 61.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Zephyrus_Awaken.png
The Flute
- Description: Beneath its rusty exterior is a lavishly decorated thin blade. It swings as swiftly as the wind.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Chord
- Skill Description(rank:5): Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals <color=#99FFFFFF>200%</color> ATK DMG to surrounding opponents. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Troupe_Awaken.png
Sacrificial Sword
- Description: A ceremonial sword that has become petrified over time. The trinkets on it are still visible. It grants the wielder the power to withstand the winds of time.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Composed
- Skill Description(rank:5): After damaging an opponent with an Elemental Skill, the skill has a <color=#99FFFFFF>80%</color> chance to end its own CD. Can only occur once every <color=#99FFFFFF>16s</color>.
- Base Stats (LV.90)
 - Base ATK: 454
 - Energy Recharge: 61.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Fossil_Awaken.png
Royal Longsword
- Description: An old longsword that belonged to the erstwhile rulers of Mondstadt. Exquisitely crafted, the carvings and embellishments testify to the stature of its owner.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Focus
- Skill Description(rank:5): Upon damaging an opponent, increases CRIT Rate by <color=#99FFFFFF>16%</color>. Max 5 stacks. A CRIT Hit removes all stacks.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Theocrat_Awaken.png
Lion's Roar
- Description: A sharp blade with extravagant carvings that somehow does not compromise on durability and sharpness. It roars like a lion as it cuts through the air.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Bane of Fire and Thunder
- Skill Description(rank:5): Increases DMG against opponents affected by Pyro or Electro by <color=#99FFFFFF>36%</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Rockkiller_Awaken.png
Prototype Rancour
- Description: An ancient longsword discovered in the Blackcliff Forge that cuts through rocks like a hot knife through butter.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Smashed Stone
- Skill Description(rank:5): On hit, Normal or Charged Attacks increase ATK and DEF by <color=#99FFFFFF>8%</color> for 6s. Max 4 stacks. This effect can only occur once every 0.3s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Physical DMG Bonus: 34.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Proto_Awaken.png
Iron Sting
- Description: An exotic long-bladed rapier that somehow found its way into Liyue via foreign traders. It is light, agile, and sharp.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Infusion Stinger
- Skill Description(rank:5): Dealing Elemental DMG increases all DMG by <color=#99FFFFFF>12%</color> for 6s. Max 2 stacks. Can occur once every 1s.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Exotic_Awaken.png
Blackcliff Longsword
- Description: A sword made of a material known as \"blackcliff.\" It has a dark crimson glow on its black blade.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Press the Advantage
- Skill Description(rank:5): After defeating an opponent, ATK is increased by <color=#99FFFFFF>24%</color> for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
- Base Stats (LV.90)
 - Base ATK: 565
 - CRIT DMG: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Blackrock_Awaken.png
The Black Sword
- Description: A pitch-black longsword that thirsts for violence and conflict. It is said that this weapon can cause its user to become drunk on the red wine of slaughter.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Justice
- Skill Description(rank:5): Increases DMG dealt by Normal and Charged Attacks by <color=#99FFFFFF>40%</color>. Additionally, regenerates <color=#99FFFFFF>100%</color> of ATK as HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Bloodstained_Awaken.png
The Alley Flash
- Description: A straight sword as black as the night. It once belonged to a thief who roamed the benighted streets.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Itinerant Hero
- Skill Description(rank:5): Increases DMG dealt by the character equipping this weapon by <color=#99FFFFFF>24%</color>. Taking DMG disables this effect for 5s.
- Base Stats (LV.90)
 - Base ATK: 620
 - Elemental Mastery: 55
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Outlaw_Awaken.png
Sword of Descension
- Description: A sword of unique craftsmanship. It does not appear to belong to this world.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Descension
- Skill Description(rank:1): <color=#99FFFFFF>Effective only on the following platform: </color>
 <color=#99FFFFFF>\"PlayStation Network\"</color>
 Hitting opponents with Normal and Charged Attacks grants a <color=#99FFFFFF>50%</color> chance to deal <color=#99FFFFFF>200%</color> ATK as DMG in a small AoE. This effect can only occur once every 10s. Additionally, if the Traveler equips the Sword of Descension, their ATK is increased by <color=#99FFFFFF>66</color>.
- Base Stats (LV.90)
 - Base ATK: 440
 - ATK: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Psalmus_Awaken.png
Festering Desire
- Description: A creepy straight sword that almost seems to yearn for life. It drips with a shriveling venom that could even corrupt a mighty dragon.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Undying Admiration
- Skill Description(rank:5): Increases Elemental Skill DMG by <color=#99FFFFFF>32%</color> and Elemental Skill CRIT Rate by <color=#99FFFFFF>12%</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Magnum_Awaken.png
Amenoma Kageuchi
- Description: A blade custom made for a famed samurai who could strike down a tengu warrior, known for their incredible agility, in midair.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Iwakura Succession
- Skill Description(rank:5): After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are consumed and after 2s, the character regenerates <color=#99FFFFFF>12</color> Energy for each seed consumed.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Bakufu_Awaken.png
Cinnabar Spindle
- Description: A sword made from materials that do not belong in this world. The power within might even be able to withstand the corruption of a venom that could corrode a mighty dragon.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Spotless Heart
- Skill Description(rank:5): Elemental Skill DMG is increased by <color=#99FFFFFF>80%</color> of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.
- Base Stats (LV.90)
 - Base ATK: 454
 - DEF: 69.0%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Opus_Awaken.png
Kagotsurube Isshin
- Description: This famed blade was born in a nation to the far north. But in the name of \"Isshin,\" it was stained with many a dark deed on its home-bound journey.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Isshin Art Clarity
- Skill Description(rank:1): When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG equal to 180% of ATK and increasing ATK by 15% for 8s. This effect can be triggered once every 8s.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Youtou_Awaken.png
Sapwood Blade
- Description: A weapon you obtained from an Aranara tale. It has taken on the shape of a blade that can cut down the foes of the forest.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Forest Sanctuary
- Skill Description(rank:5): After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character <color=#99FFFFFF>120</color> Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Arakalari_Awaken.png
Xiphos' Moonlight
- Description: This ancient double-edged sword glimmers with moonlight. It is said that a now-silent Jinni dwells within it.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Jinni's Whisper
- Skill Description(rank:5): The following effect will trigger every 10s: The equipping character will gain <color=#99FFFFFF>0.072%</color> Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Pleroma_Awaken.png
Prized Isshin Blade
- Description: An ominous purple aura clings to this bizarre blade. It has the power to control its wielder's heart and mind.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Wandering Striker
- Skill Description(rank:1): When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK and restoring 100% of ATK as HP. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_YoutouEnchanted.png
Prized Isshin Blade
- Description: The battered cursed blade shows its true form. Yet any innate endowment it might have had has been ground to dust during its journey.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Wandering Striker
- Skill Description(rank:1): When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
- Base Stats (LV.90)
 - Base ATK: 510
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_YoutouShattered.png
Prized Isshin Blade
- Description: An ominous purple aura clings to this bizarre blade. Its wicked aura and hostility have both decreased greatly.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Wandering Striker
- Skill Description(rank:1): When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK and restoring 100% of ATK as HP. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 20.7%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_YoutouEnchanted.png
Toukabou Shigure
- Description: A rather special oil-paper umbrella. While long wanderings may make one used to the wind and the rain, there might be some fun in admiring a rainy scene beneath this parasol.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Kaidan: Rainfall Earthbinder
- Skill Description(rank:5): After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This effect can be triggered once every 15s. If this opponent is defeated during Cursed Parasol's duration, Cursed Parasol's CD will be refreshed immediately. The character wielding this weapon will deal <color=#99FFFFFF>32%</color> more DMG to the opponent affected by Cursed Parasol.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Kasabouzu_Awaken.png
Wolf-Fang
- Description: Legend has it that this longsword was once used by a wandering knight in the distant past.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Northwind Wolf
- Skill Description(rank:5): DMG dealt by Elemental Skill and Elemental Burst is increased by <color=#99FFFFFF>32%</color>. When an Elemental Skill hits an opponent, its CRIT Rate will be increased by <color=#99FFFFFF>4%</color>. When an Elemental Burst hits an opponent, its CRIT Rate will be increased by <color=#99FFFFFF>4%</color>. Both of these effects last 10s separately, have 4 max stacks, and can be triggered once every 0.1s.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Boreas_Awaken.png
Finale of the Deep
- Description: This longsword is as silent as the mysterious ocean depths. It is even more ancient than its stylings might imply.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: An End Sublime
- Skill Description(rank:5): When using an Elemental Skill, ATK will be increased by <color=#99FFFFFF>24%</color> for 15s, and a Bond of Life worth 25% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, a maximum of <color=#99FFFFFF>300</color> ATK will be gained based on <color=#99FFFFFF>4.8%</color> of the total amount of the Life Bond cleared, lasting for 15s.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Vorpal_Awaken.png
Fleuve Cendre Ferryman
- Description: A handy length of abandoned copper pipe that was once used as a weapon. It was famous — or infamous, depending — in some circles.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Ironbone
- Skill Description(rank:5): Increases Elemental Skill CRIT Rate by <color=#99FFFFFF>16%</color>. Additionally, increases Energy Recharge by <color=#99FFFFFF>32%</color> for 5s after using an Elemental Skill.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Machination_Awaken.png
The Dockhand's Assistant
- Description: A convenient cutting tool that you can rarely find nowadays. You can replace the blades as they are dulled by usage.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Sea Shanty
- Skill Description(rank:5): When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain <color=#99FFFFFF>80</color> Elemental Mastery, and 2s after the effect occurs, <color=#99FFFFFF>4</color> Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - HP: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Mechanic_Awaken.png
Sword of Narzissenkreuz
- Description: A sword whose power faded when the story ended. It will now embark upon a new journey with the power that remains within it, which commemorates a certain great dream.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Hero's Blade
- Skill Description(rank:5): When the equipping character does not have an Arkhe: When Normal Attacks, Charged Attacks, or Plunging Attacks strike, a Pneuma or Ousia energy blast will be unleashed, dealing <color=#99FFFFFF>320%</color> of ATK as DMG. This effect can be triggered once every 12s. The energy blast type is determined by the current type of the Sword of Narzissenkreuz.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Purewill.png
Sword of Narzissenkreuz
- Description: A sacred blade indwelt with great enough reason and will to create and destroy a universe, or a dream.
- Rarity: 4
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: \"Holy Sword\"
- Skill Description(rank:1): In countless stories, the weapon that befits the legendary hero is also the key to opening all gates, required to surpass the climax and reach destiny's denouement.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Purewill.png
Aquila Favonia
- Description: The soul of the Knights of Favonius. Millennia later, it still calls on the winds of swift justice to vanquish all evil — just like the last heroine who wielded it.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Falcon's Defiance
- Skill Description(rank:5): ATK is increased by <color=#99FFFFFF>40%</color>. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of resistance aloft, regenerating HP equal to <color=#99FFFFFF>160%</color> of ATK and dealing <color=#99FFFFFF>320%</color> of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.
- Base Stats (LV.90)
 - Base ATK: 674
 - Physical DMG Bonus: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Falcon_Awaken.png
Skyward Blade
- Description: The sword of a knight that symbolizes the restored honor of Dvalin. The blessings of the Anemo Archon rest on the fuller of the blade, imbuing the sword with the powers of the sky and the wind.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Sky-Piercing Fang
- Skill Description(rank:5): CRIT Rate increased by <color=#99FFFFFF>8%</color>. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by <color=#99FFFFFF>10%</color>, increases ATK SPD by <color=#99FFFFFF>10%</color>, and Normal and Charged hits deal additional DMG equal to <color=#99FFFFFF>40%</color> of ATK. Skypiercing Might lasts for 12s.
- Base Stats (LV.90)
 - Base ATK: 608
 - Energy Recharge: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Dvalin_Awaken.png
Freedom-Sworn
- Description: A straight sword, azure as antediluvian song, and as keen as the oaths of freedom taken in the Land of Wind.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Revolutionary Chorale
- Skill Description(rank:5): A part of the \"Millennial Movement\" that wanders amidst the winds. Increases DMG by <color=#99FFFFFF>20%</color>. When the character wielding this weapon triggers Elemental Reactions, they gain a Sigil of Rebellion. This effect can be triggered once every 0.5s and can be triggered even if said character is not on the field. When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain \"Millennial Movement: Song of Resistance\" for 12s. \"Millennial Movement: Song of Resistance\" increases Normal, Charged and Plunging Attack DMG by <color=#99FFFFFF>32%</color> and increases ATK by <color=#99FFFFFF>40%</color>. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s. Of the many effects of the \"Millennial Movement,\" buffs of the same type will not stack.
- Base Stats (LV.90)
 - Base ATK: 608
 - Elemental Mastery: 198
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Widsith_Awaken.png
Summit Shaper
- Description: A symbol of a legendary pact, this sharp blade once cut off the peak of a mountain.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Golden Majesty
- Skill Description(rank:5): Increases Shield Strength by <color=#99FFFFFF>40%</color>. Scoring hits on opponents increases ATK by <color=#99FFFFFF>8%</color> for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Kunwu_Awaken.png
Primordial Jade Cutter
- Description: A ceremonial sword masterfully carved from pure jade. There almost seems to be an audible sigh in the wind as it is swung.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Protector's Virtue
- Skill Description(rank:5): HP increased by <color=#99FFFFFF>40%</color>. Additionally, provides an ATK Bonus based on <color=#99FFFFFF>2.4%</color> of the wielder's Max HP.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT Rate: 44.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Morax_Awaken.png
Primordial Jade Cutter
- Description: A great claymore that was once covered in moss, but turned crystal clear after both blessed and admonished by the Geo Archon.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Blunt_Awaken.png
One Side
- Description: The sword first used by an adeptus to make up for the powers he had lost. It has slain countless demons, as well as his own.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Blunt_Awaken.png
Mistsplitter Reforged
- Description: A sword that blazes with a fierce violet light. The name \"Reforged\" comes from it having been broken once before.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Mistsplitter's Edge
- Skill Description(rank:5): Gain a <color=#99FFFFFF>24%</color> Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, the Mistsplitter's Emblem provides a <color=#99FFFFFF>16/32/56%</color> Elemental DMG Bonus for the character's Elemental Type. The character will obtain 1 stack of the Mistsplitter's Emblem in each of the following scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT DMG: 44.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Narukami_Awaken.png
Haran Geppaku Futsu
- Description: A famed work by the Futsu line of smiths. The name \"Haran\" comes from the manner in which it resembles the violent, roiling waves.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Honed Flow
- Skill Description(rank:5): Obtain <color=#99FFFFFF>24%</color> All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Rippling Upheaval: each stack of Wavespike consumed will increase Normal Attack DMG by <color=#99FFFFFF>40%</color> for 8s.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT Rate: 33.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Amenoma_Awaken.png
Key of Khaj-Nisut
- Description: One of a paired set of scepters fashioned from obsidian. They say that this can be used as a key to open the gate to a paradise that lies at the end of the ocean of sand.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Sunken Song of the Sands
- Skill Description(rank:5): HP increased by <color=#99FFFFFF>40%</color>. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by <color=#99FFFFFF>0.24%</color> of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When this effect gains 3 stacks, or when the third stack's duration is refreshed, the Elemental Mastery of all nearby party members will be increased by <color=#99FFFFFF>0.4%</color> of the equipping character's max HP for 20s.
- Base Stats (LV.90)
 - Base ATK: 542
 - HP: 66.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Deshret_Awaken.png
Light of Foliar Incision
- Description: This gilded blade was made using precious white branches. It was once used to destroy countless poisons that infested the forest.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Whitemoon Bristle
- Skill Description(rank:5): CRIT Rate is increased by <color=#99FFFFFF>8%</color>. After Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing DMG dealt by Normal Attacks and Elemental Skills by <color=#99FFFFFF>240%</color> of Elemental Mastery. This effect will disappear after 28 DMG instances or 12s. You can obtain Foliar Incision once every 12s.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT DMG: 88.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Ayus_Awaken.png
Splendor of Tranquil Waters
- Description: A scepter around which swirls pure water. In days long past, it once symbolized the highest authority over the seas.
- Rarity: 5
- WeaponType: WEAPON_SWORD_ONE_HAND
- Skill Name: Dawn and Dusk by the Lake
- Skill Description(rank:5): When the equipping character's current HP increases or decreases, Elemental Skill DMG dealt will be increased by <color=#99FFFFFF>16%</color> for 6s. Max 3 stacks. This effect can be triggered once every 0.2s. When other party members' current HP increases or decreases, the equipping character's Max HP will be increased by <color=#99FFFFFF>28%</color> for 6s. Max 2 stacks. This effect can be triggered once every 0.2s. The aforementioned effects can be triggered even if the wielder is off-field.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT DMG: 88.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Sword_Regalis_Awaken.png
Waster Greatsword
- Description: A sturdy sheet of iron that may be powerful enough to break apart mountains if wielded with enough willpower.
- Rarity: 1
- WeaponType: WEAPON_CLAYMORE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Aniki_Awaken.png
Old Merc's Pal
- Description: A battle-tested greatsword that has seen better days and worse.
- Rarity: 2
- WeaponType: WEAPON_CLAYMORE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 243
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Oyaji_Awaken.png
Ferrous Shadow
- Description: A replica of the famed sword of Arundolyn, the Lion of Light. Feel the power of a legendary hero as you hold this sword in your hand! Imagine yourself as the great warrior himself! Note: Daydreaming not recommended in live combat.
- Rarity: 3
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Unbending
- Skill Description(rank:5): When HP falls below <color=#99FFFFFF>90%</color>, increases Charged Attack DMG by <color=#99FFFFFF>50%</color> and Charged Attacks become harder to interrupt.
- Base Stats (LV.90)
 - Base ATK: 401
 - HP: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Glaive_Awaken.png
Bloodtainted Greatsword
- Description: A steel sword that is said to have been coated with dragon blood, rendering it invulnerable to damage. This effect is not extended to its wielder, however.
- Rarity: 3
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Bane of Fire and Thunder
- Skill Description(rank:5): Increases DMG against opponents affected by Pyro or Electro by <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 354
 - Elemental Mastery: 187
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Siegfry_Awaken.png
White Iron Greatsword
- Description: A claymore made from white iron. Lightweight without compromising on power. Effective even when wielded by one of average strength, it is extremely deadly in the hands of a physically stronger wielder.
- Rarity: 3
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Cull the Weak
- Skill Description(rank:5): Defeating an opponent restores <color=#99FFFFFF>16%</color> HP.
- Base Stats (LV.90)
 - Base ATK: 401
 - DEF: 43.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Tin_Awaken.png
Debate Club
- Description: A handy club made of fine steel. The most persuasive line of reasoning in any debater's arsenal.
- Rarity: 3
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Blunt Conclusion
- Skill Description(rank:5): After using an Elemental Skill, on hit, Normal and Charged Attacks deal additional DMG equal to <color=#99FFFFFF>120%</color> of ATK in a small AoE. Effect lasts 15s. DMG can only occur once every 3s.
- Base Stats (LV.90)
 - Base ATK: 401
 - ATK: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Reasoning_Awaken.png
Skyrider Greatsword
- Description: A reliable steel sword. The legendary Skyrider once tried to ride it as a flying sword... for the second time.
- Rarity: 3
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Courage
- Skill Description(rank:5): On hit, Normal or Charged Attacks increase ATK by <color=#99FFFFFF>10%</color> for 6s. Max 4 stacks. Can occur once every 0.5s.
- Base Stats (LV.90)
 - Base ATK: 401
 - Physical DMG Bonus: 43.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Mitsurugi_Awaken.png
Favonius Greatsword
- Description: A heavy ceremonial sword of the Knights of Favonius. It channels elemental power easily and is highly destructive.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Windfall
- Skill Description(rank:5): CRIT Hits have a <color=#99FFFFFF>100%</color> chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every <color=#99FFFFFF>6</color>s.
- Base Stats (LV.90)
 - Base ATK: 454
 - Energy Recharge: 61.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Zephyrus_Awaken.png
The Bell
- Description: A heavy greatsword. A clock is embedded within it, though its internal mechanisms have long been damaged.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Rebellious Guardian
- Skill Description(rank:5): Taking DMG generates a shield which absorbs DMG up to <color=#99FFFFFF>32%</color> of Max HP. This shield lasts for 10s or until broken, and can only be triggered once every <color=#99FFFFFF>45</color>s. While protected by a shield, the character gains <color=#99FFFFFF>24%</color> increased DMG.
- Base Stats (LV.90)
 - Base ATK: 510
 - HP: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Troupe_Awaken.png
Sacrificial Greatsword
- Description: A ceremonial greatsword that has become petrified over time. The trinkets on it are still visible. It grants the wielder the power to withstand the winds of time.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Composed
- Skill Description(rank:5): After damaging an opponent with an Elemental Skill, the skill has a <color=#99FFFFFF>80%</color> chance to end its own CD. Can only occur once every <color=#99FFFFFF>16s</color>.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Fossil_Awaken.png
Royal Greatsword
- Description: An old greatsword that belonged to the erstwhile rulers of Mondstadt. It is made from the finest-quality materials and has stood the test of time. A weapon for use by the nobility only.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Focus
- Skill Description(rank:5): Upon damaging an opponent, increases CRIT Rate by <color=#99FFFFFF>16%</color>. Max 5 stacks. A CRIT Hit removes all stacks.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Theocrat_Awaken.png
Rainslasher
- Description: A fluorescent greatsword with no sharp edge that crushes enemies with brute force and raw power.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Bane of Storm and Tide
- Skill Description(rank:5): Increases DMG against opponents affected by Hydro or Electro by <color=#99FFFFFF>36%</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Perdue_Awaken.png
Prototype Archaic
- Description: An ancient greatsword discovered in the Blackcliff Forge. It swings with such an immense force that one feels it could cut straight through reality itself.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Crush
- Skill Description(rank:5): On hit, Normal or Charged Attacks have a 50% chance to deal an additional <color=#99FFFFFF>480%</color> ATK DMG to opponents within a small AoE. Can only occur once every 15s.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Proto_Awaken.png
Whiteblind
- Description: An exotic sword with one section of the blade left blunt. It made its way into Liyue via the hands of foreign traders. Incredibly powerful in the hands of someone who knows how to use it.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Infusion Blade
- Skill Description(rank:5): On hit, Normal or Charged Attacks increase ATK and DEF by <color=#99FFFFFF>12%</color> for 6s. Max 4 stacks. This effect can only occur once every 0.5s.
- Base Stats (LV.90)
 - Base ATK: 510
 - DEF: 51.7%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Exotic_Awaken.png
Blackcliff Slasher
- Description: An extremely sturdy greatsword from the Blackcliff Forge. It has a dark crimson color from the blade to pommel.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Press the Advantage
- Skill Description(rank:5): After defeating an enemy, ATK is increased by <color=#99FFFFFF>24%</color> for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT DMG: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Blackrock_Awaken.png
Serpent Spine
- Description: A rare weapon whose origin is the ancient ocean. One can hear the sound of the ageless waves as one swings it.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Wavesplitter
- Skill Description(rank:5): Every 4s a character is on the field, they will deal <color=#99FFFFFF>10%</color> more DMG and take <color=#99FFFFFF>2%</color> more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Kione_Awaken.png
Lithic Blade
- Description: A greatsword carved and chiseled from the very bedrock of Liyue.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Lithic Axiom: Unity
- Skill Description(rank:5): For every character in the party who hails from Liyue, the character who equips this weapon gains a <color=#99FFFFFF>11%</color> ATK increase and a <color=#99FFFFFF>7%</color> CRIT Rate increase. This effect stacks up to 4 times.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Lapis_Awaken.png
Snow-Tombed Starsilver
- Description: An ancient greatsword that was stored between frescoes. Forged from Starsilver, it has the power to cleave through ice and snow.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Frost Burial
- Skill Description(rank:5): Hitting an opponent with Normal and Charged Attacks has a <color=#99FFFFFF>100%</color> chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to <color=#99FFFFFF>140%</color> of ATK. Opponents affected by Cryo are instead dealt DMG equal to <color=#99FFFFFF>360%</color> of ATK. Can only occur once every 10s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Physical DMG Bonus: 34.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Dragonfell_Awaken.png
Luxurious Sea-Lord
- Description: The great king of the ocean. Having been air-dried, it makes for a fine weapon as well as emergency sustenance.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Oceanic Victory
- Skill Description(rank:5): Increases Elemental Burst DMG by <color=#99FFFFFF>24%</color>. When Elemental Burst hits opponents, there is a 100% chance of summoning a huge onrush of tuna that deals <color=#99FFFFFF>200%</color> ATK as AoE DMG. This effect can occur once every 15s.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_MillenniaTuna_Awaken.png
Katsuragikiri Nagamasa
- Description: A blade that was once made in Tatarasuna. Heavy and tough.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Samurai Conduct
- Skill Description(rank:5): Increases Elemental Skill DMG by <color=#99FFFFFF>12%</color>. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates <color=#99FFFFFF>5</color> Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Bakufu_Awaken.png
Makhaira Aquamarine
- Description: An ancient greatsword that gleams like the waters themselves. A thousand years of sand erosion has not dulled its unnaturally sharp edge one bit.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Desert Pavilion
- Skill Description(rank:5): The following effect will trigger every 10s: The equipping character will gain <color=#99FFFFFF>48%</color> of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Pleroma_Awaken.png
Akuoumaru
- Description: The beloved sword of the legendary \"Akuou.\" The blade is huge and majestic, but is surprisingly easy to wield.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Watatsumi Wavewalker
- Skill Description(rank:5): For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by <color=#99FFFFFF>0.24%</color>. A maximum of <color=#99FFFFFF>80%</color> increased Elemental Burst DMG can be achieved this way.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Maria_Awaken.png
Forest Regalia
- Description: A weapon you obtained from an Aranara tale. It has taken on the shape of a greatsword that shall cut down the foes of the forest.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Forest Sanctuary
- Skill Description(rank:5): After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character <color=#99FFFFFF>120</color> Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Arakalari_Awaken.png
Mailed Flower
- Description: A graceful and elegant greatsword that is decorated with flowers and ribbons.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Whispers of Wind and Flower
- Skill Description(rank:5): Within 8s after the character's Elemental Skill hits an opponent or the character triggers an Elemental Reaction, their ATK and Elemental Mastery will be increased by <color=#99FFFFFF>24%</color> and <color=#99FFFFFF>96</color> respectively.
- Base Stats (LV.90)
 - Base ATK: 565
 - Elemental Mastery: 110
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Fleurfair_Awaken.png
Talking Stick
- Description: Most people will find this obsidian-inlaid club quite convincing indeed.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: \"The Silver Tongue\"
- Skill Description(rank:5): ATK will be increased by <color=#99FFFFFF>32%</color> for 15s after being affected by Pyro. This effect can be triggered once every 12s. All Elemental DMG Bonus will be increased by <color=#99FFFFFF>24%</color> for 15s after being affected by Hydro, Cryo, Electro, or Dendro. This effect can be triggered once every 12s.
- Base Stats (LV.90)
 - Base ATK: 565
 - CRIT Rate: 18.4%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_BeastTamer_Awaken.png
Tidal Shadow
- Description: An exquisitely-crafted, standard-model sword forged for the high-ranking officers and flagship captains of Fontaine's old navy.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: White Cruising Wave
- Skill Description(rank:5): After the wielder is healed, ATK will be increased by <color=#99FFFFFF>48%</color> for 8s. This can be triggered even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Vorpal_Awaken.png
\"Ultimate Overlord's Mega Magic Sword\"
- Description: A magical sword that can only be wielded by the ultimate overlord who rules the seas. As it has been made with special water-resistant materials, it will not get ruined by water damage even after being immersed. Why, one might even call it invincible!
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Melussistance!
- Skill Description(rank:5): ATK increased by <color=#99FFFFFF>24%</color>. That's not all! The support from all Melusines you've helped in Merusea Village fills you with strength! Based on the number of them you've helped, your ATK is increased by up to an additional <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Champion_Awaken.png
Portable Power Saw
- Description: An old-school power saw that you can rarely find nowadays. It was once a cutting tool trusted by workers all around.
- Rarity: 4
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Sea Shanty
- Skill Description(rank:5): When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain <color=#99FFFFFF>80</color> Elemental Mastery, and 2s after the effect occurs, <color=#99FFFFFF>4</color> Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 454
 - HP: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Mechanic_Awaken.png
Skyward Pride
- Description: A claymore that symbolizes the pride of Dvalin soaring through the skies. When swung, it emits a deep hum as the full force of Dvalin's command of the sky and the wind is unleashed.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Sky-ripping Dragon Spine
- Skill Description(rank:5): Increases all DMG by <color=#99FFFFFF>16%</color>. After using an Elemental Burst, a vacuum blade that does <color=#99FFFFFF>160%</color> of ATK as DMG to opponents along its path will be created when Normal or Charged Attacks hit. Lasts for 20s or 8 vacuum blades.
- Base Stats (LV.90)
 - Base ATK: 674
 - Energy Recharge: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Dvalin_Awaken.png
Wolf's Gravestone
- Description: A longsword used by the Wolf Knight. Originally just a heavy sheet of iron given to the knight by a blacksmith from the city, it became endowed with legendary power owing to his friendship with the wolves.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Wolfish Tracker
- Skill Description(rank:5): Increases ATK by <color=#99FFFFFF>40%</color>. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by <color=#99FFFFFF>80%</color> for 12s. Can only occur once every 30s.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Wolfmound_Awaken.png
Song of Broken Pines
- Description: A greatsword as light as the sigh of grass in the breeze, yet as merciless to the corrupt as a typhoon.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Rebel's Banner-Hymn
- Skill Description(rank:5): A part of the \"Millennial Movement\" that wanders amidst the winds. Increases ATK by <color=#99FFFFFF>32%</color>, and when Normal or Charged Attacks hit opponents, the character gains a Sigil of Whispers. This effect can be triggered once every 0.3s. When you possess 4 Sigils of Whispers, all of them will be consumed and all nearby party members will obtain the \"Millennial Movement: Banner-Hymn\" effect for 12s. \"Millennial Movement: Banner-Hymn\" increases Normal ATK SPD by <color=#99FFFFFF>24%</color> and increases ATK by <color=#99FFFFFF>40%</color>. Once this effect is triggered, you will not gain Sigils of Whispers for 20s. Of the many effects of the \"Millennial Movement,\" buffs of the same type will not stack.
- Base Stats (LV.90)
 - Base ATK: 741
 - Physical DMG Bonus: 20.7%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Widsith_Awaken.png
The Unforged
- Description: Capable of driving away evil spirits and wicked people alike, this edgeless claymore seems to possess divine might.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Golden Majesty
- Skill Description(rank:5): Increases Shield Strength by <color=#99FFFFFF>40%</color>. Scoring hits on opponents increases ATK by <color=#99FFFFFF>8%</color> for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Kunwu_Awaken.png
Primordial Jade Greatsword
- Description: A jade greatsword that once belonged to an Archon, and cast into the depths of the ocean to calm a monstrous storm.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 330
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Aniki_Awaken.png
The Other Side
- Description: The alternative ending to the story between the first adeptus and the last illuminated beast. It was the bridge on which a mutual compromise was reached. It's blunt but powerful.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 330
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Aniki_Awaken.png
Redhorn Stonethresher
- Description: According to its previous owner, this weapon is the \"Mighty Redhorn Stoic Stonethreshing Gilded Goldcrushing Lion Lord\" that can send any monster packing with its tail between its legs.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Gokadaiou Otogibanashi
- Skill Description(rank:5): DEF is increased by <color=#99FFFFFF>56%</color>. Normal and Charged Attack DMG is increased by <color=#99FFFFFF>80%</color> of DEF.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT DMG: 88.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Itadorimaru_Awaken.png
Beacon of the Reed Sea
- Description: A large, flat-tipped sword designed in to fit as the weapon of an ancient king or some ceremonial instrument.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Desert Watch
- Skill Description(rank:5): After the character's Elemental Skill hits an opponent, their ATK will be increased by <color=#99FFFFFF>40%</color> for 8s. After the character takes DMG, their ATK will be increased by <color=#99FFFFFF>40%</color> for 8s. The 2 aforementioned effects can be triggered even when the character is not on the field. Additionally, when not protected by a shield, the character's Max HP will be increased by <color=#99FFFFFF>64%</color>.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT Rate: 33.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_Deshret_Awaken.png
Verdict
- Description: A weapon once used by a young maiden who forsook her family name, stained with the blood of enemies and loved ones both.
- Rarity: 5
- WeaponType: WEAPON_CLAYMORE
- Skill Name: Many Oaths of Dawn and Dusk
- Skill Description(rank:5): Increases ATK by <color=#99FFFFFF>40%</color>. When party members obtain Elemental Shards from Crystallize reactions, the equipping character will gain 1 Seal, increasing Elemental Skill DMG by <color=#99FFFFFF>36%</color>. The Seal lasts for 15s, and the equipper may have up to 2 Seals at once. All of the equipper's Seals will disappear 0.2s after their Elemental Skill deals DMG.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT Rate: 22.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Claymore_GoldenVerdict_Awaken.png
Beginner's Protector
- Description: A polearm as straight as a flag pole. Well suited to most combat situations, it has an imposing presence when swung.
- Rarity: 1
- WeaponType: WEAPON_POLE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Gewalt_Awaken.png
Iron Point
- Description: Sharp and pointy at one end, it is a balanced weapon that is quite popular among travelers.
- Rarity: 2
- WeaponType: WEAPON_POLE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 243
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Rod_Awaken.png
White Tassel
- Description: A standard-issue weapon of the Millelith soldiers. It has a sturdy shaft and sharp spearhead. It's a reliable weapon.
- Rarity: 3
- WeaponType: WEAPON_POLE
- Skill Name: Sharp
- Skill Description(rank:5): Increases Normal Attack DMG by <color=#99FFFFFF>48%</color>.
- Base Stats (LV.90)
 - Base ATK: 401
 - CRIT Rate: 23.4%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Ruby_Awaken.png
Halberd
- Description: A polearm with an axe blade mounted on top that can deal quite a lot of damage. It's favored by the Millelith officers.
- Rarity: 3
- WeaponType: WEAPON_POLE
- Skill Name: Heavy
- Skill Description(rank:5): Normal Attacks deal an additional <color=#99FFFFFF>320%</color> ATK as DMG. This effect can only occur once every 10s.
- Base Stats (LV.90)
 - Base ATK: 448
 - ATK: 23.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Halberd_Awaken.png
Black Tassel
- Description: An exceptionally powerful polearm that also offers a simple but elegant solution to the issue of the easily stained white tassel.
- Rarity: 3
- WeaponType: WEAPON_POLE
- Skill Name: Bane of the Soft
- Skill Description(rank:5): Increases DMG against slimes by <color=#99FFFFFF>80%</color>.
- Base Stats (LV.90)
 - Base ATK: 354
 - HP: 46.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Noire_Awaken.png
Dragon's Bane
- Description: A polearm decorated with an entwining golden dragon. Light and sharp, this weapon may very well kill dragons with ease.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Bane of Flame and Water
- Skill Description(rank:5): Increases DMG against opponents affected by Hydro or Pyro by <color=#99FFFFFF>36%</color>.
- Base Stats (LV.90)
 - Base ATK: 454
 - Elemental Mastery: 221
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Stardust_Awaken.png
Prototype Starglitter
- Description: A hooked spear discovered hidden away in the Blackcliff Forge. The glimmers along the sharp edge are like stars in the night.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Magic Affinity
- Skill Description(rank:5): After using an Elemental Skill, increases Normal and Charged Attack DMG by <color=#99FFFFFF>16%</color> for 12s. Max 2 stacks.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Proto_Awaken.png
Crescent Pike
- Description: An exotic weapon with an extremely long blade on the top and a crescent blade at the bottom. It found its way into Liyue through foreign traders. With practice, it can deal heavy damage.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Infusion Needle
- Skill Description(rank:5): After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal additional DMG equal to <color=#99FFFFFF>40%</color> of ATK for 5s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Physical DMG Bonus: 34.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Exotic_Awaken.png
Blackcliff Pole
- Description: A weapon made of blackcliff and aerosiderite. There is a dark crimson glow on its cold black sheen.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Press the Advantage
- Skill Description(rank:5): After defeating an enemy, ATK is increased by <color=#99FFFFFF>24%</color> for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT DMG: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Blackrock_Awaken.png
Deathmatch
- Description: A sharp crimson polearm that was once a gladiator's priceless treasure. Its awl has been stained by the blood of countless beasts and men.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Gladiator
- Skill Description(rank:5): If there are at least 2 opponents nearby, ATK is increased by <color=#99FFFFFF>32%</color> and DEF is increased by <color=#99FFFFFF>32%</color>. If there are fewer than 2 opponents nearby, ATK is increased by <color=#99FFFFFF>48%</color>.
- Base Stats (LV.90)
 - Base ATK: 454
 - CRIT Rate: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Gladiator_Awaken.png
Lithic Spear
- Description: A spear forged from the rocks of the Guyun Stone Forest. Its hardness knows no equal.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Lithic Axiom: Unity
- Skill Description(rank:5): For every character in the party who hails from Liyue, the character who equips this weapon gains a <color=#99FFFFFF>11%</color> ATK increase and a <color=#99FFFFFF>7%</color> CRIT Rate increase. This effect stacks up to 4 times.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Lapis_Awaken.png
Favonius Lance
- Description: A polearm made in the style of the Knights of Favonius. Its shaft is straight, and its tip flows lightly like the wind.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Windfall
- Skill Description(rank:5): CRIT Hits have a <color=#99FFFFFF>100%</color> chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every <color=#99FFFFFF>6</color>s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Zephyrus_Awaken.png
Royal Spear
- Description: This polearm was once cherished by a member of the old nobility that governed Mondstadt long ago. Although it has never seen the light of day, it is still incomparably sharp.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Focus
- Skill Description(rank:5): Upon damaging an opponent, increases CRIT Rate by <color=#99FFFFFF>16%</color>. Max 5 stacks. A CRIT Hit removes all stacks.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Theocrat_Awaken.png
Dragonspine Spear
- Description: A spear created from the fang of a dragon. It is oddly warm to the touch.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Frost Burial
- Skill Description(rank:5): Hitting an opponent with Normal and Charged Attacks has a <color=#99FFFFFF>100%</color> chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to <color=#99FFFFFF>140%</color> of ATK. Opponents affected by Cryo are instead dealt DMG equal to <color=#99FFFFFF>360%</color> of ATK. Can only occur once every 10s.
- Base Stats (LV.90)
 - Base ATK: 454
 - Physical DMG Bonus: 69.0%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Everfrost_Awaken.png
Kitain Cross Spear
- Description: A special lance that was once used by a famed warrior who guarded the Tatarigami on Yashiori Island.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Samurai Conduct
- Skill Description(rank:5): Increases Elemental Skill DMG by <color=#99FFFFFF>12%</color>. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates <color=#99FFFFFF>5</color> Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - Elemental Mastery: 110
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Bakufu_Awaken.png
\"The Catch\"
- Description: In the distant past, this was the beloved spear of a famed Inazuman bandit.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Shanty
- Skill Description(rank:5): Increases Elemental Burst DMG by <color=#99FFFFFF>32%</color> and Elemental Burst CRIT Rate by <color=#99FFFFFF>12%</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Mori_Awaken.png
Wavebreaker's Fin
- Description: A naginata forged from luminescent material deep in the ocean depths. It was once the possession of the tengu race.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Watatsumi Wavewalker
- Skill Description(rank:5): For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by <color=#99FFFFFF>0.24%</color>. A maximum of <color=#99FFFFFF>80%</color> increased Elemental Burst DMG can be achieved this way.
- Base Stats (LV.90)
 - Base ATK: 620
 - ATK: 13.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Maria_Awaken.png
Moonpiercer
- Description: A weapon you obtained from an Aranara tale. It is shaped like a giant arrow and can be used as a spear.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Stillwood Moonshadow
- Skill Description(rank:5): After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character <color=#99FFFFFF>32%</color> ATK for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - Elemental Mastery: 110
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Arakalari_Awaken.png
Missive Windspear
- Description: A beacon that shows the direction of the wind. Not every idyll carried on the breeze remains a gentle thing...
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: The Wind Unattained
- Skill Description(rank:5): Within 10s after an Elemental Reaction is triggered, ATK is increased by <color=#99FFFFFF>24%</color> and Elemental Mastery is increased by <color=#99FFFFFF>96</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Windvane_Awaken.png
Ballad of the Fjords
- Description: A polearm used by those seeking to catch fish in the tundra. It lets none escape.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Tales of the Tundra
- Skill Description(rank:5): When there are at least 3 different Elemental Types in your party, Elemental Mastery will be increased by <color=#99FFFFFF>240.</color>
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Shanty_Awaken.png
Rightful Reward
- Description: A sharp spear. Only its tip remains freshly bloodstained.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Tip of the Spear
- Skill Description(rank:5): When the wielder is healed, restore <color=#99FFFFFF>16</color> Energy. This effect can be triggered once every 10s, and can occur even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - HP: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Vorpal_Awaken.png
Prospector's Drill
- Description: A long-handled drill that you can rarely find nowadays. It was often used in delving and in carving stones.
- Rarity: 4
- WeaponType: WEAPON_POLE
- Skill Name: Masons' Ditty
- Skill Description(rank:5): When the wielder is healed or heals others, they will gain a Unity's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Struggle effect will be granted for 10s. For each Symbol consumed, gain <color=#99FFFFFF>7%</color> ATK and <color=#99FFFFFF>13%</color> All Elemental DMG Bonus. The Struggle effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Mechanic_Awaken.png
Staff of Homa
- Description: A \"firewood staff\" that was once used in ancient and long-lost rituals.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Reckless Cinnabar
- Skill Description(rank:5): HP increased by <color=#99FFFFFF>40%</color>. Additionally, provides an ATK Bonus based on <color=#99FFFFFF>1.6%</color> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK Bonus is increased by an additional <color=#99FFFFFF>1.8%</color> of Max HP.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT DMG: 66.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Homa_Awaken.png
Skyward Spine
- Description: A polearm that symbolizes Dvalin's firm resolve. The upright shaft of this weapon points towards the heavens, clad in the might of sky and wind.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Black Wing
- Skill Description(rank:5): Increases CRIT Rate by <color=#99FFFFFF>16%</color> and increases Normal ATK SPD by <color=#99FFFFFF>12%</color>. Additionally, Normal and Charged Attacks hits on opponents have a <color=#99FFFFFF>50%</color> chance to trigger a vacuum blade that deals <color=#99FFFFFF>100%</color> of ATK as DMG in a small AoE. This effect can occur no more than once every 2s.
- Base Stats (LV.90)
 - Base ATK: 674
 - Energy Recharge: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Dvalin_Awaken.png
Vortex Vanquisher
- Description: This sharp polearm can seemingly pierce through anything. When swung, one can almost see the rift it tears in the air.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Golden Majesty
- Skill Description(rank:5): Increases Shield Strength by <color=#99FFFFFF>40%</color>. Scoring hits on opponents increases ATK by <color=#99FFFFFF>8%</color> for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Kunwu_Awaken.png
Primordial Jade Winged-Spear
- Description: A jade polearm made by the archons, capable of slaying ancient beasts.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Eagle Spear of Justice
- Skill Description(rank:5): On hit, increases ATK by <color=#99FFFFFF>6%</color> for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT Rate: 22.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Morax_Awaken.png
Deicide
- Description: A weapon that was once used to kill an archon. It's a weapon of sheer will, with power that rivals that of the gods.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 321
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Gewalt_Awaken.png
Calamity Queller
- Description: A keenly honed weapon forged from some strange crystal. Its faint blue light seems to whisper of countless matters now past.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Extinguishing Precept
- Skill Description(rank:5): Gain <color=#99FFFFFF>24%</color> All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by <color=#99FFFFFF>6.4%</color> per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.
- Base Stats (LV.90)
 - Base ATK: 741
 - ATK: 16.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Santika_Awaken.png
Engulfing Lightning
- Description: A naginata used to \"cut grass.\" Any army that stands before this weapon will probably be likewise cut down...
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Timeless Dream: Eternal Stove
- Skill Description(rank:5): ATK increased by <color=#99FFFFFF>56%</color> of Energy Recharge over the base 100%. You can gain a maximum bonus of <color=#99FFFFFF>120%</color> ATK. Gain <color=#99FFFFFF>50%</color> Energy Recharge for 12s after using an Elemental Burst.
- Base Stats (LV.90)
 - Base ATK: 608
 - Energy Recharge: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Narukami_Awaken.png
Staff of the Scarlet Sands
- Description: One of a paired set of scepters fashioned from obsidian. Legend has it that these staves grant the right to lead the people of the desert, but no retainer now lives who can verify the proper appearance of these regalia.
- Rarity: 5
- WeaponType: WEAPON_POLE
- Skill Name: Heat Haze at Horizon's End
- Skill Description(rank:5): The equipping character gains <color=#99FFFFFF>104%</color> of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 10s: The equipping character will gain <color=#99FFFFFF>56%</color> of their Elemental Mastery as bonus ATK. Max 3 stacks.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT Rate: 44.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Pole_Deshret_Awaken.png
Apprentice's Notes
- Description: Notes left behind by a top student. Many useful spells are listed, and the handwriting is beautiful.
- Rarity: 1
- WeaponType: WEAPON_CATALYST
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Apprentice_Awaken.png
Pocket Grimoire
- Description: A carefully compiled notebook featuring the essentials needed to pass a magic exam.
- Rarity: 2
- WeaponType: WEAPON_CATALYST
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 243
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Pocket_Awaken.png
Magic Guide
- Description: Version 12. A reprint featuring corrections to Version 11 and brand-new additions based on recent developments.
- Rarity: 3
- WeaponType: WEAPON_CATALYST
- Skill Name: Bane of Storm and Tide
- Skill Description(rank:5): Increases DMG against opponents affected by Hydro or Electro by <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 354
 - Elemental Mastery: 187
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Intro_Awaken.png
Thrilling Tales of Dragon Slayers
- Description: A fictional story of a band of five heroes who go off on a dragon hunt. It is poorly written and structurally incoherent. Its value lies in the many lessons that can be learned from failure.
- Rarity: 3
- WeaponType: WEAPON_CATALYST
- Skill Name: Heritage
- Skill Description(rank:5): When switching characters, the new character taking the field has their ATK increased by <color=#99FFFFFF>48%</color> for 10s. This effect can only occur once every 20s.
- Base Stats (LV.90)
 - Base ATK: 401
 - HP: 35.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Pulpfic_Awaken.png
Otherworldly Story
- Description: A cheap fantasy novel with no value whatsoever. Any claim that it possesses the power of catalysis is also pure fantasy.
- Rarity: 3
- WeaponType: WEAPON_CATALYST
- Skill Name: Energy Shower
- Skill Description(rank:5): Each Elemental Orb or Particle collected restores <color=#99FFFFFF>2%</color> HP.
- Base Stats (LV.90)
 - Base ATK: 401
 - Energy Recharge: 39.0%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Lightnov_Awaken.png
Emerald Orb
- Description: A catalyst carved out of the hard jade from Jueyun Karst north of Liyue. Small, light, and durable, it is known more colloquially as the \"jade ball.\"
- Rarity: 3
- WeaponType: WEAPON_CATALYST
- Skill Name: Rapids
- Skill Description(rank:5): Upon causing a Vaporize, Electro-Charged, Frozen, Bloom, or a Hydro-infused Swirl reaction, increases ATK by <color=#99FFFFFF>40%</color> for 12s.
- Base Stats (LV.90)
 - Base ATK: 448
 - Elemental Mastery: 94
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Jade_Awaken.png
Twin Nephrite
- Description: A jade pendant formed by piecing together two jade stones.
- Rarity: 3
- WeaponType: WEAPON_CATALYST
- Skill Name: Guerilla Tactics
- Skill Description(rank:5): Defeating an opponent increases Movement SPD and ATK by <color=#99FFFFFF>20%</color> for 15s.
- Base Stats (LV.90)
 - Base ATK: 448
 - CRIT Rate: 15.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Phoney_Awaken.png
Favonius Codex
- Description: A secret tome that belonged to the scholars of the Knights of Favonius. It describes the logic and power of elements and matter.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Windfall
- Skill Description(rank:5): CRIT Hits have a <color=#99FFFFFF>100%</color> chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every <color=#99FFFFFF>6</color>s.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Zephyrus_Awaken.png
The Widsith
- Description: A heavy notebook filled with musical scores. Though suffering from moth damage and heavy wear-and-tear, there is still much power to be found among the hand-written words within.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Debut
- Skill Description(rank:5): When the character takes the field, they will gain a random theme song for 10s. This can only occur once every 30s. Recitative: ATK is increased by <color=#99FFFFFF>120%</color>. Aria: Increases all Elemental DMG by <color=#99FFFFFF>96%</color>. Interlude: Elemental Mastery is increased by <color=#99FFFFFF>480</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT DMG: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Troupe_Awaken.png
Sacrificial Fragments
- Description: A weathered script, the text of which is no longer legible. A cursed item eroded by the winds of time.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Composed
- Skill Description(rank:5): After damaging an opponent with an Elemental Skill, the skill has a <color=#99FFFFFF>80%</color> chance to end its own CD. Can only occur once every <color=#99FFFFFF>16s</color>.
- Base Stats (LV.90)
 - Base ATK: 454
 - Elemental Mastery: 221
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Fossil_Awaken.png
Royal Grimoire
- Description: A book that once belonged to a court mage of Mondstadt who served the nobility. It contains faithful and comprehensive historical accounts as well as magic spells.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Focus
- Skill Description(rank:5): Upon damaging an opponent, increases CRIT Rate by <color=#99FFFFFF>16%</color>. Max 5 stacks. A CRIT Hit removes all stacks.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Theocrat_Awaken.png
Solar Pearl
- Description: A dull, golden pearl made of an unknown substance that harbors the light of the sun and the moon and pulses with a warm strength.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Solar Shine
- Skill Description(rank:5): Normal Attack hits increase Elemental Skill and Elemental Burst DMG by <color=#99FFFFFF>40%</color> for 6s. Likewise, Elemental Skill or Elemental Burst hits increase Normal Attack DMG by <color=#99FFFFFF>40%</color> for 6s.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Resurrection_Awaken.png
Prototype Amber
- Description: A dully gilded catalyst secretly guarded in the Blackcliff Forge. It seems to glow with the very light from the sky.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Gilding
- Skill Description(rank:5): Using an Elemental Burst regenerates <color=#99FFFFFF>6</color> Energy every 2s for 6s. All party members will regenerate <color=#99FFFFFF>6%</color> HP every 2s for this duration.
- Base Stats (LV.90)
 - Base ATK: 510
 - HP: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Proto_Awaken.png
Mappa Mare
- Description: A nautical chart featuring nearby currents and climates that somehow found its way into Liyue via foreign traders.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Infusion Scroll
- Skill Description(rank:5): Triggering an Elemental reaction grants a <color=#99FFFFFF>16%</color> Elemental DMG Bonus for 10s. Max 2 stacks.
- Base Stats (LV.90)
 - Base ATK: 565
 - Elemental Mastery: 110
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Exotic_Awaken.png
Blackcliff Agate
- Description: A mysterious catalyst made of a material known as \"blackcliff.\" It has an ominous crimson glow that seems to pulse in synchronization with the tremors from deep within the earth.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Press the Advantage
- Skill Description(rank:5): After defeating an enemy, ATK is increased by <color=#99FFFFFF>24%</color> for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT DMG: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Blackrock_Awaken.png
Eye of Perception
- Description: A dim black glaze pearl that is said to have the power to read the purity of one's heart.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Echo
- Skill Description(rank:5): Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing <color=#99FFFFFF>360%</color> ATK as DMG. This bolt can bounce between opponents a maximum of 4 times. This effect can occur once every <color=#99FFFFFF>8</color>s.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Truelens_Awaken.png
Wine and Song
- Description: A songbook from the bygone aristocratic era, whose composer has become forgotten. It chronicles the tale of a certain heroic outlaw.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Ever-Changing
- Skill Description(rank:5): Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate Sprint by <color=#99FFFFFF>22%</color> for 5s. Additionally, using a Sprint or Alternate Sprint ability increases ATK by <color=#99FFFFFF>40%</color> for 5s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Outlaw_Awaken.png
Frostbearer
- Description: A fruit that possesses a strange, frosty will. A faint sense of agony emanates from it.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Frost Burial
- Skill Description(rank:5): Hitting an opponent with Normal and Charged Attacks has a <color=#99FFFFFF>100%</color> chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to <color=#99FFFFFF>140%</color> of ATK. Opponents affected by Cryo are instead dealt DMG equal to <color=#99FFFFFF>360%</color> of ATK. Can only occur once every 10s.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Everfrost_Awaken.png
Dodoco Tales
- Description: A children's book filled with childish short stories at which one cannot help but laugh.
 Even those readers who have long reached adulthood cannot help but be absorbed by the innocent, naive little adventures portrayed within.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Dodoventure!
- Skill Description(rank:5): Normal Attack hits on opponents increase Charged Attack DMG by <color=#99FFFFFF>32%</color> for 6s. Charged Attack hits on opponents increase ATK by <color=#99FFFFFF>16%</color> for 6s.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Ludiharpastum_Awaken.png
Hakushin Ring
- Description: A catalyst that carries the memory of the Kitsune Saiguu of ancient times. However, this device is but an impoverished vessel for the full breadth of her thought.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Sakura Saiguu
- Skill Description(rank:5): After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of an Elemental Type involved in the elemental reaction receive a <color=#99FFFFFF>20%</color> Elemental DMG Bonus for their element, lasting 6s. Elemental Bonuses gained in this way cannot be stacked.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Bakufu_Awaken.png
Oathsworn Eye
- Description: A national treasure of Byakuyakoku stored in the Dainichi Mikoshi. With the coming of the Serpent God, this item was used to notarize great oaths and wishes.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: People of the Faltering Light
- Skill Description(rank:5): Increases Energy Recharge by <color=#99FFFFFF>48%</color> for 10s after using an Elemental Skill.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Jyanome_Awaken.png
Wandering Evenstar
- Description: This was originally a device used by researchers to observe and perform calculations on celestial phenomena. It serves as a conduit and catalyst.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Wildling Nightstar
- Skill Description(rank:5): The following effect will trigger every 10s: The equipping character will gain <color=#99FFFFFF>48%</color> of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Pleroma_Awaken.png
Fruit of Fulfillment
- Description: A fruit you obtained from an Aranara tale. It holds the potential to conquer any crisis.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Full Circle
- Skill Description(rank:5): Obtain the \"Wax and Wane\" effect after an Elemental Reaction is triggered, gaining <color=#99FFFFFF>36</color> Elemental Mastery while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max 5 stacks. For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can be triggered even when the character is off-field.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Arakalari_Awaken.png
Sacrificial Jade
- Description: An ancient jade pendant that gleams like clear water. It seems to have been used in ancient ceremonies.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Jade Circulation
- Skill Description(rank:5): When not on the field for more than 5s, Max HP will be increased by <color=#99FFFFFF>64%</color> and Elemental Mastery will be increased by <color=#99FFFFFF>80</color>. These effects will be canceled after the wielder has been on the field for 10s.
- Base Stats (LV.90)
 - Base ATK: 454
 - CRIT Rate: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Yue_Awaken.png
Flowing Purity
- Description: A strangely-shaped anthology of scripts. All the scripts written by Coppelius are recorded within.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Unfinished Masterpiece
- Skill Description(rank:5): When using an Elemental Skill, All Elemental DMG Bonus will be increased by <color=#99FFFFFF>16%</color> for 15s, and a Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, every 1,000 HP cleared in the process will provide <color=#99FFFFFF>4%</color> All Elemental DMG Bonus, up to a maximum of <color=#99FFFFFF>24%</color>. This effect lasts 15s.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Vorpal_Awaken.png
Ballad of the Boundless Blue
- Description: An anthology of exquisite poetry. It contains quite a few poems beloved by Mondstadters, concerning the skies, dandelions, and other such topics.
- Rarity: 4
- WeaponType: WEAPON_CATALYST
- Skill Name: Azure Skies
- Skill Description(rank:5): Within 6s after Normal or Charged Attacks hit an opponent, Normal Attack DMG will be increased by <color=#99FFFFFF>16%</color> and Charged Attack DMG will be increased by <color=#99FFFFFF>12%</color>. Max 3 stacks. This effect can be triggered once every 0.3s.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_DandelionPoem_Awaken.png
Skyward Atlas
- Description: A cloud atlas symbolizing Dvalin and his former master, the Anemo Archon. It details the winds and clouds of the northern regions and contains the powers of the sky and wind.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Wandering Clouds
- Skill Description(rank:5): Increases Elemental DMG Bonus by <color=#99FFFFFF>24%</color>. Normal Attack hits have a 50% chance to earn the favor of the clouds, which actively seek out nearby opponents to attack for 15s, dealing <color=#99FFFFFF>320%</color> ATK DMG. Can only occur once every 30s.
- Base Stats (LV.90)
 - Base ATK: 674
 - ATK: 33.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Dvalin_Awaken.png
Lost Prayer to the Sacred Winds
- Description: An educational tome written by anonymous early inhabitants who worshiped the wind. It has been blessed by the wind for its faithfulness and influence over the millennia.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Boundless Blessing
- Skill Description(rank:5): Increases Movement SPD by 10%. When in battle, gain a <color=#99FFFFFF>16%</color> Elemental DMG Bonus every 4s. Max 4 stacks. Lasts until the character falls or leaves combat.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT Rate: 33.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Fourwinds_Awaken.png
Lost Ballade
- Description: Legend has it that the bard who walked with the God of Winds has seen a thousand worlds. The Ballade keeps a record of many wonders, and grand powers. Some segments were lost, others, forgotten. We are only able to piece together his grand adventure from the remaining segments.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 321
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Apprentice_Awaken.png
Memory of Dust
- Description: A stone dumbbell containing distant memories. Its endless transformations reveal the power within.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Golden Majesty
- Skill Description(rank:5): Increases Shield Strength by <color=#99FFFFFF>40%</color>. Scoring hits on opponents increases ATK by <color=#99FFFFFF>8%</color> for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Kunwu_Awaken.png
Jadefall's Splendor
- Description: A ritual vessel carved from jade that reflects the luster of the skies and the clear waters.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Primordial Jade Regalia
- Skill Description(rank:5): For 3s after using an Elemental Burst or creating a shield, the equipping character can gain the Primordial Jade Regalia effect: Restore <color=#99FFFFFF>6.5</color> Energy every 2.5s, and gain <color=#99FFFFFF>1.1%</color> Elemental DMG Bonus for their corresponding Elemental Type for every 1,000 Max HP they possess, up to <color=#99FFFFFF>44%</color>. Primordial Jade Regalia will still take effect even if the equipping character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 608
 - HP: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Morax_Awaken.png
Everlasting Moonglow
- Description: A string of lovely jasper from the deep sea. It shines with a pure radiance like that of the moon, and just as ever-distant.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Byakuya Kougetsu
- Skill Description(rank:5): Healing Bonus increased by <color=#99FFFFFF>20%</color>, Normal Attack DMG is increased by <color=#99FFFFFF>3%</color> of the Max HP of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.
- Base Stats (LV.90)
 - Base ATK: 608
 - HP: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Kaleido_Awaken.png
Kagura's Verity
- Description: The bells used when performing the Kagura Dance, blessed by the Guuji herself. The scent of the Sacred Sakura tree lingers on it.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Kagura Dance of the Sacred Sakura
- Skill Description(rank:5): Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character wielding this weapon to increase by <color=#99FFFFFF>24%</color> for 16s. Max 3 stacks. This character will gain <color=#99FFFFFF>24%</color> All Elemental DMG Bonus when they possess 3 stacks.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT DMG: 66.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Narukami_Awaken.png
A Thousand Floating Dreams
- Description: This lamp illuminates the dreams that float up over a thousand nights, and in its emerald-green light flows a song of ancient days.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: A Thousand Nights' Dawnsong
- Skill Description(rank:5): Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by <color=#99FFFFFF>64</color>. If not, increase the equipping character's DMG Bonus from their Elemental Type by <color=#99FFFFFF>26%</color>. The aforementioned effects can have 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by <color=#99FFFFFF>48</color>. Multiple such effects from multiple such weapons can stack.
- Base Stats (LV.90)
 - Base ATK: 542
 - Elemental Mastery: 265
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Ayus_Awaken.png
Tulaytullah's Remembrance
- Description: A bell crafted of deep sapphire and sterling silver. Its echoes are as crisp as they are distant.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Bygone Azure Teardrop
- Skill Description(rank:5): Normal Attack SPD is increased by <color=#99FFFFFF>20%</color>. After the wielder unleashes an Elemental Skill, Normal Attack DMG will increase by <color=#99FFFFFF>9.6%</color> every second for 14s. After hitting an opponent with a Normal Attack during this duration, Normal Attack DMG will be increased by <color=#99FFFFFF>19.2%</color>. This increase can be triggered once every 0.3s. The maximum Normal Attack DMG increase per single duration of the overall effect is <color=#99FFFFFF>96%</color>. The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset all DMG buffs.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT DMG: 44.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Alaya_Awaken.png
Cashflow Supervision
- Description: A floating device that can monitor certain phenomena. It was picked up and modified to serve other purposes following its abandonment.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Golden Blood-Tide
- Skill Description(rank:5): ATK is increased by <color=#99FFFFFF>32%</color>. When current HP increases or decreases, Normal Attack DMG will be increased by <color=#99FFFFFF>32%</color> and Charged Attack DMG will be increased by <color=#99FFFFFF>28%</color> for 4s. Max 3 stacks. This effect can be triggered once every 0.3s. When the wielder has 3 stacks, ATK SPD will be increased by <color=#99FFFFFF>16%</color>.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT Rate: 22.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Wheatley_Awaken.png
Tome of the Eternal Flow
- Description: A manual that was once passed down from generation to generation within an underwater priory. Today, none know of its existence.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Aeon Wave
- Skill Description(rank:5): HP is increased by <color=#99FFFFFF>32%</color>. When current HP increases or decreases, Charged Attack DMG will be increased by <color=#99FFFFFF>30%</color> for 4s. Max 3 stacks. This effect can be triggered once every 0.3s. When the character has 3 stacks or a third stack's duration refreshes, <color=#99FFFFFF>12</color> Energy will be restored. This Energy restoration effect can be triggered once every 12s.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT DMG: 88.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_Iudex_Awaken.png
Crane's Echoing Call
- Description: A fan carved from pure jade, around which swirls an ancient aura of adeptal energy.
- Rarity: 5
- WeaponType: WEAPON_CATALYST
- Skill Name: Cloudfall Axiom
- Skill Description(rank:5): After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks will deal <color=#99FFFFFF>80%</color> increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore <color=#99FFFFFF>3.5</color> Energy to the equipping character. Energy can be restored this way every 0.7s. This energy regain effect can be triggered even if the equipping character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 741
 - ATK: 16.5%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Catalyst_MountainGale_Awaken.png
Hunter's Bow
- Description: A hunter's music consists of but two sounds: the twang of the bowstring and the whoosh of soaring arrows.
- Rarity: 1
- WeaponType: WEAPON_BOW
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 185
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Hunters_Awaken.png
Seasoned Hunter's Bow
- Description: A bow that has been well-polished by time and meticulously cared for by its owner. It feels almost like an extension of the archer's arm.
- Rarity: 2
- WeaponType: WEAPON_BOW
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 243
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Old_Awaken.png
Raven Bow
- Description: Ravens are known to be the ferrymen of the dead. This bow's limb is decorated with raven feathers, which forebode the imminent death of its target.
- Rarity: 3
- WeaponType: WEAPON_BOW
- Skill Name: Bane of Flame and Water
- Skill Description(rank:5): Increases DMG against opponents affected by Hydro or Pyro by <color=#99FFFFFF>24%</color>.
- Base Stats (LV.90)
 - Base ATK: 448
 - Elemental Mastery: 94
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Crowfeather_Awaken.png
Sharpshooter's Oath
- Description: This superior bow once belonged to a master archer. However, it gives off a strong scent, thus making it unsuitable for hunting.
- Rarity: 3
- WeaponType: WEAPON_BOW
- Skill Name: Precise
- Skill Description(rank:5): Increases DMG against weak spots by <color=#99FFFFFF>48%</color>.
- Base Stats (LV.90)
 - Base ATK: 401
 - CRIT DMG: 46.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Arjuna_Awaken.png
Recurve Bow
- Description: It is said that this bow can shoot down eagles in flight, but ultimately how true that is depends on the skill of the archer.
- Rarity: 3
- WeaponType: WEAPON_BOW
- Skill Name: Cull the Weak
- Skill Description(rank:5): Defeating an opponent restores <color=#99FFFFFF>16%</color> HP.
- Base Stats (LV.90)
 - Base ATK: 354
 - HP: 46.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Curve_Awaken.png
Slingshot
- Description: A bow, despite the name. After countless experiments and improvements to the design, the creator of the ultimate slingshot found himself to have made what was actually a bow.
- Rarity: 3
- WeaponType: WEAPON_BOW
- Skill Name: Slingshot
- Skill Description(rank:5): If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by <color=#99FFFFFF>60%</color>. Otherwise, decreases DMG by 10%.
- Base Stats (LV.90)
 - Base ATK: 354
 - CRIT Rate: 31.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Sling_Awaken.png
Messenger
- Description: A basic wooden bow. It is said to have once been used as a tool for long-distance communication.
- Rarity: 3
- WeaponType: WEAPON_BOW
- Skill Name: Archer's Message
- Skill Description(rank:5): Charged Attack hits on weak points deal an additional <color=#99FFFFFF>200%</color> ATK DMG as CRIT DMG. Can only occur once every 10s.
- Base Stats (LV.90)
 - Base ATK: 448
 - CRIT DMG: 31.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Msg_Awaken.png
Favonius Warbow
- Description: A standard-issue recurve bow of the Knights of Favonius. Only the best archers can unleash its full potential.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Windfall
- Skill Description(rank:5): CRIT Hits have a <color=#99FFFFFF>100%</color> chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every <color=#99FFFFFF>6</color>s.
- Base Stats (LV.90)
 - Base ATK: 454
 - Energy Recharge: 61.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Zephyrus_Awaken.png
The Stringless
- Description: A bow that once served as an extraordinary instrument. It is no longer capable of getting people up and dancing.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Arrowless Song
- Skill Description(rank:5): Increases Elemental Skill and Elemental Burst DMG by <color=#99FFFFFF>48%</color>.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Troupe_Awaken.png
Sacrificial Bow
- Description: A ceremonial hunting bow that has become petrified over time. The trinkets on it are still visible. It grants the wielder the power to withstand the winds of time.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Composed
- Skill Description(rank:5): After damaging an opponent with an Elemental Skill, the skill has a <color=#99FFFFFF>80%</color> chance to end its own CD. Can only occur once every <color=#99FFFFFF>16s</color>.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Fossil_Awaken.png
Royal Bow
- Description: An old longbow that belonged to the erstwhile aristocratic rulers of Mondstadt. Countless generations later, the bowstring is still tight and can still fire arrows with great force.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Focus
- Skill Description(rank:5): Upon damaging an opponent, increases CRIT Rate by <color=#99FFFFFF>16%</color>. Max 5 stacks. A CRIT Hit removes all stacks.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Theocrat_Awaken.png
Rust
- Description: A completely rusted iron greatbow. The average person would lack the strength to even lift it, let alone fire it.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Rapid Firing
- Skill Description(rank:5): Increases Normal Attack DMG by <color=#99FFFFFF>80%</color> but decreases Charged Attack DMG by 10%.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Recluse_Awaken.png
Prototype Crescent
- Description: A prototype longbow discovered in the Blackcliff Forge. The arrow fired from this bow glimmers like a ray of moonlight.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Unreturning
- Skill Description(rank:5): Charged Attack hits on weak points increase Movement SPD by 10% and ATK by <color=#99FFFFFF>72%</color> for 10s.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Proto_Awaken.png
Compound Bow
- Description: An exotic metallic bow from a distant land. Though extremely difficult to maintain, it is easy to nock and fires with tremendous force.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Infusion Arrow
- Skill Description(rank:5): Normal Attack and Charged Attack hits increase ATK by <color=#99FFFFFF>8%</color> and Normal ATK SPD by <color=#99FFFFFF>2.4%</color> for 6s. Max 4 stacks. Can only occur once every 0.3s.
- Base Stats (LV.90)
 - Base ATK: 454
 - Physical DMG Bonus: 69.0%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Exotic_Awaken.png
Blackcliff Warbow
- Description: A bow made of blackcliff that features extremely sturdy bow limbs. It requires an archer with a strong bow arm to use.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Press the Advantage
- Skill Description(rank:5): After defeating an enemy, ATK is increased by <color=#99FFFFFF>24%</color> for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
- Base Stats (LV.90)
 - Base ATK: 565
 - CRIT DMG: 36.8%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Blackrock_Awaken.png
The Viridescent Hunt
- Description: A pure green hunting bow. This once belonged to a certain hunter whose home was the forest.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Verdant Wind
- Skill Description(rank:5): Upon hit, Normal and Charged Attacks have a 50% chance to generate a Cyclone, which will continuously attract surrounding opponents, dealing <color=#99FFFFFF>80%</color> of ATK as DMG to these opponents every 0.5s for 4s. This effect can only occur once every <color=#99FFFFFF>10</color>s.
- Base Stats (LV.90)
 - Base ATK: 510
 - CRIT Rate: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Viridescent_Awaken.png
Alley Hunter
- Description: An intricate, opulent longbow. It once belonged to a gentleman thief who was never caught.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Oppidan Ambush
- Skill Description(rank:5): While the character equipped with this weapon is in the party but not on the field, their DMG increases by <color=#99FFFFFF>4%</color> every second up to a max of <color=#99FFFFFF>40%</color>. When the character is on the field for more than 4s, the aforementioned DMG buff decreases by <color=#99FFFFFF>8%</color> per second until it reaches 0%.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Outlaw_Awaken.png
Fading Twilight
- Description: A precious bow made of platinum, inlaid with an orb that shimmers with the light of eventide.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Radiance of the Deeps
- Skill Description(rank:5): Has three states, Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by <color=#99FFFFFF>12%/20%/28%</color> respectively. When attacks hit opponents, this weapon will switch to the next state. This weapon can change states once every 7s. The character equipping this weapon can still trigger the state switch while not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - Energy Recharge: 30.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Fallensun_Awaken.png
Mitternachts Waltz
- Description: A bow painted the color of transgression and nights of illusion.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Evernight Duet
- Skill Description(rank:5): Normal Attack hits on opponents increase Elemental Skill DMG by <color=#99FFFFFF>40%</color> for 5s. Elemental Skill hits on opponents increase Normal Attack DMG by <color=#99FFFFFF>40%</color> for 5s.
- Base Stats (LV.90)
 - Base ATK: 510
 - Physical DMG Bonus: 51.7%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Nachtblind_Awaken.png
Windblume Ode
- Description: A bow adorned with nameless flowers that bears the earnest hopes of an equally nameless person.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Windblume Wish
- Skill Description(rank:5): After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing ATK by <color=#99FFFFFF>32%</color> for 6s.
- Base Stats (LV.90)
 - Base ATK: 510
 - Elemental Mastery: 165
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Fleurfair_Awaken.png
Hamayumi
- Description: A certain shrine maiden once owned this warbow. It was made with surpassing skill, and is both intricate and sturdy.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Full Draw
- Skill Description(rank:5): Increases Normal Attack DMG by <color=#99FFFFFF>32%</color> and Charged Attack DMG by <color=#99FFFFFF>24%</color>. When the equipping character's Energy reaches 100%, this effect is increased by 100%.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Bakufu_Awaken.png
Predator
- Description: A uniquely-designed bow. This should not belong in this world.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Strong Strike
- Skill Description(rank:1): <color=#99FFFFFF>Effective only on the following platform: </color>
 <color=#99FFFFFF>\"PlayStation Network\"</color>
 Dealing Cryo DMG to opponents increases this character's Normal and Charged Attack DMG by 10% for 6s. This effect can have a maximum of 2 stacks. Additionally, when Aloy equips Predator, ATK is increased by 66.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Predator_Awaken.png
Mouun's Moon
- Description: A lovely warbow made from seashells and coral. A mournful brilliance flows along its moonlight-colored arms.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Watatsumi Wavewalker
- Skill Description(rank:5): For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by <color=#99FFFFFF>0.24%</color>. A maximum of <color=#99FFFFFF>80%</color> increased Elemental Burst DMG can be achieved this way.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Maria_Awaken.png
King's Squire
- Description: A weapon you obtained from an Aranara tale. It has taken on the shape of a bow that can shoot the enemies of the forest down.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Labyrinth Lord's Instruction
- Skill Description(rank:5): Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing Elemental Mastery by <color=#99FFFFFF>140</color> for 12s. This effect will be removed when switching characters. When the Teachings of the Forest effect ends or is removed, it will deal <color=#99FFFFFF>180%</color> of ATK as DMG to 1 nearby opponent. The Teachings of the Forest effect can be triggered once every 20s.
- Base Stats (LV.90)
 - Base ATK: 454
 - ATK: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Arakalari_Awaken.png
End of the Line
- Description: This seems to be a now-extinct fish. Its body is sufficiently elastic that a string may be attached to it to let it serve as a bow.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Net Snapper
- Skill Description(rank:5): Triggers the Flowrider effect after using an Elemental Skill, dealing <color=#99FFFFFF>160%</color> ATK as AoE DMG upon hitting an opponent with an attack. Flowrider will be removed after 15s or after causing 3 instances of AoE DMG. Only 1 instance of AoE DMG can be caused every 2s in this way. Flowrider can be triggered once every 12s.
- Base Stats (LV.90)
 - Base ATK: 510
 - Energy Recharge: 45.9%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Fin_Awaken.png
Ibis Piercer
- Description: A golden bow forged from the description in the story. If you use it as a normal weapon, you can also view it as a part of a fictional world that has made it off the pages.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Secret Wisdom's Favor
- Skill Description(rank:5): The character's Elemental Mastery will increase by <color=#99FFFFFF>80</color> within 6s after Charged Attacks hit opponents. Max 2 stacks. This effect can be triggered once every 0.5s.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Ibis_Awaken.png
Scion of the Blazing Sun
- Description: An ancient longbow that is a remnant of King Deshret's ancient era. An indecipherable ancient text and solemn patterns have been carved into it.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: The Way of Sunfire
- Skill Description(rank:5): After a Charged Attack hits an opponent, a Sunfire Arrow will descend upon the opponent hit, dealing <color=#99FFFFFF>120%</color> ATK as DMG, and applying the Heartsearer effect to the opponent damaged by said Arrow for 10s. Opponents affected by Heartsearer take <color=#99FFFFFF>56%</color> more Charged Attack DMG from the wielder. A Sunfire Arrow can be triggered once every 10s.
- Base Stats (LV.90)
 - Base ATK: 565
 - CRIT Rate: 18.4%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Gurabad_Awaken.png
Song of Stillness
- Description: A strange longbow that resembles a sea creature. Its string makes no sound at all.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Benthic Pulse
- Skill Description(rank:5): After the wielder is healed, they will deal <color=#99FFFFFF>32%</color> more DMG for 8s. This can be triggered even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 510
 - ATK: 41.3%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Vorpal_Awaken.png
Range Gauge
- Description: A measuring instrument that you can rarely find nowadays. It is capable of firing arrows.
- Rarity: 4
- WeaponType: WEAPON_BOW
- Skill Name: Masons' Ditty
- Skill Description(rank:5): When the wielder is healed or heals others, they will gain a Unity's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Struggle effect will be granted for 10s. For each Symbol consumed, gain <color=#99FFFFFF>7%</color> ATK and <color=#99FFFFFF>13%</color> All Elemental DMG Bonus. The Struggle effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.
- Base Stats (LV.90)
 - Base ATK: 565
 - ATK: 27.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Mechanic_Awaken.png
Skyward Harp
- Description: A greatbow that symbolizes Dvalin's affiliation with the Anemo Archon. The sound of the bow firing is music to the Anemo Archon's ears. It contains the power of the sky and wind within.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: Echoing Ballad
- Skill Description(rank:5): Increases CRIT DMG by <color=#99FFFFFF>40%</color>. Hits have a <color=#99FFFFFF>100%</color> chance to inflict a small AoE attack, dealing 125% Physical ATK DMG. Can only occur once every <color=#99FFFFFF>2</color>s.
- Base Stats (LV.90)
 - Base ATK: 674
 - CRIT Rate: 22.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Dvalin_Awaken.png
Amos' Bow
- Description: An extremely ancient bow that has retained its power despite its original master being long gone. It draws power from everyone and everything in the world, and the further away you are from that which your heart desires, the more powerful it is.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: Strong-Willed
- Skill Description(rank:5): Increases Normal and Charged Attack DMG by <color=#99FFFFFF>24%</color>. After a Normal or Charged Attack is fired, DMG dealt increases by a further <color=#99FFFFFF>16%</color> every 0.1s the arrow is in the air for up to 5 times.
- Base Stats (LV.90)
 - Base ATK: 608
 - ATK: 49.6%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Amos_Awaken.png
Elegy for the End
- Description: A bow as lovely as any bard's lyre, its arrows pierce the heart like a lamenting sigh.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: The Parting Refrain
- Skill Description(rank:5): A part of the \"Millennial Movement\" that wanders amidst the winds. Increases Elemental Mastery by <color=#99FFFFFF>120</color>. When the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, that character gains a Sigil of Remembrance. This effect can be triggered once every 0.2s and can be triggered even if said character is not on the field. When you possess 4 Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the \"Millennial Movement: Farewell Song\" effect for 12s. \"Millennial Movement: Farewell Song\" increases Elemental Mastery by <color=#99FFFFFF>200</color> and increases ATK by <color=#99FFFFFF>40%</color>. Once this effect is triggered, you will not gain Sigils of Remembrance for 20s. Of the many effects of the \"Millennial Movement,\" buffs of the same type will not stack.
- Base Stats (LV.90)
 - Base ATK: 608
 - Energy Recharge: 55.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Widsith_Awaken.png
Kunwu's Wyrmbane
- Description: A greatbow made from dragon vein. It is so powerful that it could slay a dragon. A nocked arrow fires with the force of thunder.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 321
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Hunters_Awaken.png
Primordial Jade Vista
- Description: A strong bow that was made from ancient jade, with a bowstring made from a single beam of converging light. Possesses enough power to protect a kingdom.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 321
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Hunters_Awaken.png
Mirror Breaker
- Description: A weapon fragment from the epic battle waged by ancient extraterrestrial conquerors. It once had the power to extinguish moonlight.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: undefined
- Skill Description(rank:1):
- Base Stats (LV.70)
 - Base ATK: 302
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Hunters_Awaken.png
Polar Star
- Description: A pristine bow that is as sharp as the glaciers of the far north.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: Daylight's Augury
- Skill Description(rank:5): Elemental Skill and Elemental Burst DMG increased by <color=#99FFFFFF>24%</color>. After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s. When 1/2/3/4 stacks of Ashen Nightstar are present, ATK is increased by <color=#99FFFFFF>20/40/60/96%</color>. The stack of Ashen Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst will be counted independently of the others.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT Rate: 33.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Worldbane_Awaken.png
Aqua Simulacra
- Description: This longbow's color is unpredictable. Under the light, it takes on a lustrous, watery blue.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: The Cleansing Form
- Skill Description(rank:5): HP is increased by <color=#99FFFFFF>32%</color>. When there are opponents nearby, the DMG dealt by the wielder of this weapon is increased by <color=#99FFFFFF>40%</color>. This will take effect whether the character is on-field or not.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT DMG: 88.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Kirin_Awaken.png
Thundering Pulse
- Description: A longbow that was a gift from the Shogun. Eternal lightning crackles all around it.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: Rule by Thunder
- Skill Description(rank:5): Increases ATK by <color=#99FFFFFF>40%</color> and grants the might of the Thunder Emblem. At stack levels 1/2/3, the Thunder Emblem increases Normal Attack DMG by <color=#99FFFFFF>24/48/80%</color>. The character will obtain 1 stack of Thunder Emblem in each of the following scenarios: Normal Attack deals DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT DMG: 66.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Narukami_Awaken.png
Hunter's Path
- Description: This gilded bow was made using precious white branches. It has felled countless wicked beasts attempting to infiltrate the woods.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: At the End of the Beast-Paths
- Skill Description(rank:5): Gain <color=#99FFFFFF>24%</color> All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack. This effect increases Charged Attack DMG by <color=#99FFFFFF>320%</color> of Elemental Mastery. This effect will be removed after 12 Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained every 12s.
- Base Stats (LV.90)
 - Base ATK: 542
 - CRIT Rate: 44.1%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Ayus_Awaken.png
The First Great Magic
- Description: A stage prop once used by a past \"Great Magician.\" Its final secret was that it was also a weapon beyond the pale.
- Rarity: 5
- WeaponType: WEAPON_BOW
- Skill Name: Parsifal the Great
- Skill Description(rank:5): DMG dealt by Charged Attacks increased by <color=#99FFFFFF>32%</color>. For every party member with the same Elemental Type as the wielder (including the wielder themselves), gain 1 Gimmick stack. For every party member with a different Elemental Type from the wielder, gain 1 Theatrics stack. When the wielder has 1/2/3 or more Gimmick stacks, ATK will be increased by <color=#99FFFFFF>32%/64%/96%</color>. When the wielder has 1/2/3 or more Theatrics stacks, Movement SPD will be increased by <color=#99FFFFFF>12%/15%/18%</color>.
- Base Stats (LV.90)
 - Base ATK: 608
 - CRIT DMG: 66.2%
- Icon URL: https://enka.network/ui/UI_EquipIcon_Bow_Pledge_Awaken.png
*/