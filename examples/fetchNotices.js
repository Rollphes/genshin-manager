const { Client, NoticeManager } = require('genshin-manager')
async function main() {
  const client = new Client()
  await client.deploy()

  const noticeManager = new NoticeManager('en')
  await noticeManager.update()

  noticeManager.notices.forEach((notice) => {
    console.log(notice.title)
    console.log(`- Subtitle: ${notice.subtitle}`)
    console.log(`- ID: ${notice.id}`)
    console.log(`- Description: ${notice.text.replace(/\n/g, '\n  ')}`)
    console.log(`- Reward image URL: ${notice.rewardImg?.url ?? 'undefined'}`)
    console.log(`- Banner URL: ${notice.banner.url}`)
    if (notice.eventStart && notice.eventEnd) {
      console.log(`- Event start: ${notice.eventStart}`)
      console.log(`- Event end: ${notice.eventEnd}`)
    } else {
      console.log(`- Event Duration: ${notice.eventDuration}`)
    }
  })
  process.exit(0)
}
void main()

/** Sample output:
Version 4.4 New Content Overview
- Subtitle: Version 4.4 New Content Overview
- ID: 20338
- Description:
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/30/158f2510332d5c49eea8232dbc65111a_3537255603608000681.jpg
- Banner URL:
- Event Duration: undefined
"Vibrant Harriers Aloft in Spring Breeze" Version 4.4 Update Details
- Subtitle: Version 4.4 Update Details
- ID: 20286
- Description: Dear Travelers,
 Below are the details of the Version 4.4 update "Vibrant Harriers Aloft in Spring Breeze" and the update compensation.

 〓Compensation Details〓
 Maintenance Compensation: Primogems ×300 (60 Primogems per hour the servers are down)
 Issue Fix Compensation: Primogems ×300 (please refer to the relevant compensation mail for more details)

 〓Scope of Compensation〓
 Maintenance Compensation: Travelers who have reached Adventure Rank 5 or above by 2024/01/31 07:00.
 Compensation must be claimed before the end of Version 4.4.

 Issue Fix Compensation: Travelers who reach Adventure Rank 5 or above by 2024/01/31 07:00.
 Please log in and claim your compensation before 2024/02/03 07:00.

 Our developers will distribute compensation to Travelers via in-game mail within 5 hours after the update maintenance is finished. The mail will expire after 30 days, so don't forget to claim the attached compensation in time.

 〓Update Schedule〓
 Update maintenance begins 2024/01/31 07:00 and is estimated to take 5 hours.

 〓How to Update Game Client〓
 PC: Close the game, open the Genshin Impact Launcher, and click Update.
 iOS: Open the App Store and tap Update.
 Android: Open the game and follow the directions on-screen.
 PS5™ and PS4™: Highlight Genshin Impact from the Home Screen, press the OPTIONS button and select "Check for Update."
 Please do not hesitate to contact Customer Service if you encounter any issues installing the new version. We will do our very best to resolve the issue.

 〓Update Details〓
 I. New Areas
 ◇ New Areas: In Version 4.4, the following areas in Liyue will become available: Chenyu Vale: Upper Vale, Chenyu Vale: Southern Mountain, and Mt. Laixin.

 ※ As long as you have completed Archon Quest Prologue: Act III "Song of the Dragon and Freedom," a Teleport Waypoint will be automatically unlocked near Liyue's Chenyu Vale: Upper Vale (If you have already completed this Archon Quest, the Teleport Waypoint will be unlocked after the update). You'll also receive the Primogem reward for this Teleport Waypoint when it unlocks automatically.

 ▌New System in Liyue
 Rainjade Oblation
 Fujin's adeptal energy has transformed into many Spirit Carp that are scattered all over Chenyu Vale. Collect the energy within Spirit Carp and transfer it into the Votive Rainjade within Carp's Rest to increase its level and obtain the blessings of Chenyu Vale.
 Rainjade Oblation System Unlock Criteria:
 • Complete the World Quest "The Cloud-Padded Path to the Chiwang Repose"

 In addition, there will be new Fishing Points and "Radiant Spincrystals" in Liyue.

 II. New Characters
 ◇ Vision: Anemo
 ◇ Weapon: Catalyst
 ◇ One of the Mighty and Illuminated Adepti of Jueyun, known as "Cloud Retainer." Expert in all kinds of mechanical contraptions, her heart now turns towards the affairs of the mortal world, through which she walks under the name "Xianyun."
 ◆ Elemental Skill "White Clouds at Dawn"
 ◆ Xianyun enters the Cloud Transmogrification state, in which she will not take Fall DMG, and uses Skyladder once. In this state, Xianyun can cast Skyladder continuously to leap, where her Plunging Attack will be converted into an even stronger Driftcloud Wave instead, which deals AoE Anemo DMG. The more times Skyladder is used, the more DMG the resulting Driftcloud Wave will deal and the larger its AoE.
 ◆ Elemental Burst "Stars Gather at Dusk"
 ◆ Brings forth a sacred breeze that deals AoE Anemo DMG and heals all nearby characters. It will also summon the "Starwicker" mechanism that follows the active character and periodically heals all nearby party members. When the Starwicker has Adeptal Assistance stacks, characters will have their jump height increased. When they complete a Plunging Attack, Adeptal Assistance stacks will be consumed and deal AoE Anemo DMG.
 ◇ Vision: Pyro
 ◇ Weapon: Claymore
 ◇ Guard of the Sword and Strongbox Secure Transport Agency, and the head of the "Mighty Mythical Beasts" Wushou troupe.
 ◆ Elemental Skill "Bestial Ascent"
 ◆ Gaming pounces forward using the Wushou arts, leaping high into the air after coming into contact with a target or surface. If he immediately uses a Plunging Attack, he will use Plunging Attack: Charmed Cloudstrider instead, dealing AoE Pyro DMG to opponents hit.
 ◆ Elemental Burst "Suanni's Gilded Dance"
 ◆ Gaming enters Wushou Stance, briefly applying Pyro to him, recovering a fixed amount of HP, and summons his companion, the Suanni Man Chai, to smash into his target, dealing AoE Pyro DMG. After doing so, Man Chai will then attempt to roll towards Gaming. When it links up with Gaming, Man Chai will leave the field and reset the CD for Gaming's Elemental Skill, Bestial Ascent. While Wushou Stance is active, his resistance to interruption is increased, and when Gaming lands with Charmed Cloudstrider attack or completes the forward pounce attack from Bestial Ascent with over 50% HP, he will summon Man Chai again.

 III. New Equipment
 New Weapon (Examples based on Refinement Rank 1)
 After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks will deal 28% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5 Energy to the equipping character. Energy can be restored this way every 0.7s. This energy regain effect can be triggered even if the equipping character is not on the field.
 ◆ During the event wish "Epitome Invocation," the event-exclusive 5-star weapon Crane's Echoing Call (Catalyst) will receive a huge drop-rate boost!

 IV. New Outfits
 ◇ A light and graceful festive outfit accented mainly in black nightshade and cerulean blue. Its hair accessory is as radiant as the Qingxin — a pairing that Ganyu is most fond of.
 ◆ Between the start of the Version 4.4 update and 2024/03/11 04:59, Ganyu's outfit "Twilight Blossom" will be available for purchase in the Character Outfit Shop at a limited-time discount! During the discount period, the price of the outfit is 1,350 Genesis Crystals. The price will revert to 1,680 Genesis Crystals after the limited-time discount ends. The outfit can only be purchased once.
 ◇ This Lantern Rite gift that Shenhe received is a set of elegant formal attire that her master, Cloud Retainer had commissioned for her. Red ropes still adorn her arms, but the bitter cold in Shenhe's heart has faded.
 ◆ Between the start of the Version 4.4 update and 2024/03/11 04:59, Shenhe's outfit "Frostflower Dew" will be available for purchase in the Character Outfit Shop at a limited-time discount! During the discount period, the price of the outfit is 1,350 Genesis Crystals. The price will revert to 1,680 Genesis Crystals after the limited-time discount ends. The outfit can only be purchased once.
 ◇ Formal wear prepared by the Feiyun Commerce Guild for Xingqiu. The bamboo prints are refined and the cut is most flattering, but Xingqiu's favorite aspect of the outfit is its inner pockets, into which a thinner novel might be stuffed.
 ◆ During Version 4.4, Travelers can obtain Xingqiu's outfit "Bamboo Rain" for free by participating in the limited-time "Vibrant Harriers Aloft in Spring Breeze" event.
 ◆ After Version 4.4 is over, Travelers can buy the outfit in the Character Outfit Shop.

 V. New Main Story
 1. New Story Quest
 Permanently available after the Version 4.4 update
 ◆ Quest Unlock Criteria:
 • Reach Adventure Rank 40 or above
 • Complete Archon Quest Interlude Chapter: Act I "The Crane Returns on the Wind"

 2. New World Quests
 ◆ New World Quests: "Chenyu's Blessings of Sunken Jade" Quest Chain, "The Cloud-Padded Path to the Chiwang Repose," "Threefold Expectations," "A Wangshan Walk to Remember," "Scrolls and Sword Manuals of Guhua," "Shrouded Vale, Hidden Hero," "The Roaming Abode," "The Dealing Sands," "Our Chenyu Vale Trek," "Chili Con Cloudy," "Qiaoying, the Village of Many Tales," "Temporary Acclimatization," etc.

 VI. New Enemies
 ◇ These elegant and proud mystical beasts only live in mountains shrouded in adeptal energy.
 It can use Hydro and Anemo simultaneously in battle. Render it Frozen while it is gathering Hydro-aligned adeptal energy, before using Shatter, Melt, or other Elemental Reactions to break the ice and cause it to enter an immobile state. When it is gathering Anemo-aligned adeptal energy, use attacks from Elements that can react with Anemo to destroy the Spiritwind Pearls summoned during the process to achieve the same advantage.
 Located at Chenyu Vale: Southern Mountain
 ◇ Fierce creatures that inhabit the mountains of Chenyu Vale.
 Use Elemental Reactions to freeze this creature and use Shatter, Melt, and other Elemental Reactions to break the ice and render it immobile temporarily.

 VII. Other Update Details
 New Recipes:
 ○ Chef Mao (NPC): Honey Char Siu
 ○ Lianfang (NPC): Chenyu Brew, Jadevein Tea Eggs, and Tea-Smoked Squab
 ○ Licai (NPC): Deep-Fried Doublecrisp and Braised Meatballs
 ○ World Quest Rewards: Guhua Fish & Lamb Soup and Fine Tea, Full Moon.
 ○ Event Reward: Eight-Treasure Duck
 New Character Specialty Dishes:
 ○ Xianyun's specialty: "Encompassing Gladness"
 ○ Gaming's specialty: "Yummy Yum Cha"
 Adds new "Chenyu's Splendor" Achievement category, and adds new Achievements to the "Wonders of the World" category.
 Adds Set 29 of "Paimon's Paintings" chat emojis.
 Adds some prompts for loading screens.
 New Namecards:
 "Xianyun: White Clouds": Reward for reaching Friendship Lv. 10 with Xianyun
 "Gaming: Man Chai": Reward for reaching Friendship Lv. 10 with Gaming
 "Achievement: Adeptal Valley": Reward for completing all achievements under "Chenyu's Splendor"
 "Chenyu: Rainjade Rite": Reward for reaching Rainjade Oblation Level 10
 "Travel Notes: Vibrant Harriers": Reward obtained via the BP system
 New Wildlife: Fluff-Fleece Goat, Malachitin Lumibug, Redbill Pelican, Jadestone Turtle, and Velvetfall Duck
 New Fish: Jade Heartfeather Bass
 New Function: Fast Equip Artifacts
 (1) Quick Configuration: A set of Artifacts will be put together for your reference based on data from recently active players. When generating a configuration, it will only consider Artifacts not already equipped by other characters.
 (2) Custom Configuration: Custom Configuration data will be based on the settings laid out for each character. When using a Custom Configuration, you can configure based on conditions such as Artifact Main Affix, Set Type, and Minor Affixes and choose whether or not to use Artifacts that haven't already been equipped. The configuration created by Custom Configuration can be adjusted, with alternative Artifacts sorted based on the overall priority levels of their Artifact Set and Affixes. When "Other Options" > "All" is selected in Custom Configuration, when the configuration includes Artifacts already equipped by another character, the Artifacts will be removed and equipped to the target character.
 Adds the "Borderless Mode" fullscreen option in "Display Mode" in "Settings / Graphics" interface on PC.
 "Genius Invokation TCG" Gameplay Update:
 New Character Cards: Thoma, Sayu, and their corresponding Talent cards. Corresponding invitation duels and guest challenges have been added to the Player List.
 New Character Cards: Cryo Hypostasis, Millennial Pearl Seahorse, and their corresponding Talent Cards. Their Tavern Challenges have also been added.
 New Action Cards: "Sapwood Blade," "Veteran's Visage," "Jeht," "Silver and Melus," "Machine Assembly Line," "Sunyata Flower," and "Matsutake Meat Rolls" can be purchased from Prince at The Cat's Tail.
 The Forge Realm's Temper is once again available. The theme of this edition is "The Forge Realm's Temper: Clever Stratagems":
 (1) During The Forge Realm's Temper: Clever Stratagems, you can select the parameters for each stage. Parameters that may be set include: stage difficulty, the round limit for the match, and enemy bonus HP.
 (2) After you complete a certain stage battle, you will gain a score based on the difficulty selected for each parameter in said stage. At the same time, you can claim the corresponding rewards when your highest score reaches a specific score.

 Spiral Abyss

 Floor 11 Ley Line Disorder changed to:
 • All characters in the party gain a 75% Anemo DMG Bonus.

 Updated the monster lineup on Floors 11 – 12 of the Spiral Abyss.

 Starting from the first time that the Lunar Phase refreshes after updating to Version 4.4, the three Lunar Phases will be as follows:

 Phase I:
 Ascendant Moon
 When a character receives healing, it will be counted. When the count reaches a total of 16, a shockwave will be unleashed at the character's position, dealing True DMG to nearby opponents and clearing the count. 1 such shockwave can be unleashed every 8s.

 Phase II:
 Resilient Moon
 After the active character's Plunging Attacks hit opponents, the character's Plunging Attack DMG is increased by 20% for 8s. This effect can be triggered once every 0.1s. Max 3 stacks. Each stack's duration is counted independently. This effect will be cleared if the character leaves the field.

 Phase III:
 Plummeting Moon
 After the active character's Plunging Attacks hit opponents, unleash a shockwave at the character's location, dealing True DMG to nearby opponents. 1 such shockwave can be unleashed every 2s.

 〓Adjustments & Optimizations〓
 ● Serenitea Pot
 Adds new Furnishing categories, reclassifies certain Furnishings, and adjusts the sorting of certain categories.
 Refactors the filter function in the "Inventory > Furnishings" and "Creation / Furnishings" interfaces, now supporting more conditions and allowing direct searches.
 When placing Furnishings using the same editing mode, your current position in lists will be remembered. It will not be reset after switching to another Furnishing category.
 Adds the display of Friendship Levels in the Companion tab on the editing screen. Characters without Friendship Lv. 10 will be displayed in descending order of Friendship Level.
 Optimizes the sorting of Character Hangout Events and their corresponding Hangout Memories in the Furnishing "Lingering Moment."

 ● Genius Invokation TCG
 Standardizes the skill descriptions of certain cards in some challenges.
 Adjusts the text description for the Talent Card "Rending Vortex" of the Character Card "Dvalin" (actual effect remains unchanged).
 The original description was: "When your Dvalin, who has this card equipped, is on the field, when Total Collapse attached to opposing active character is removed: Apply Total Collapse to the next opposing standby character."
 The adjusted description is: "When your Dvalin, who has this card equipped, is on the field, when Total Collapse attached to an opposing character is removed: Apply Total Collapse to the next opposing standby character."

 ● System
 Increases the number of party compositions in the "Party Setup > Configure Team" interface from 10 to 15.
 Renames "Fullscreen" in "Display Mode" to "Borderless" in the "Settings / Graphics" interface in the Irminsul Server on PC (actual display effect remains unchanged; after said adjustment, available options in "Display Mode" in the Irminsul Server on PC are "Borderless" and "Windowed").
 Adds a red notification dot in the "Adventurer Handbook > Commissions" interface to remind Travelers to go to the Adventurers' Guild and claim Bonus Rewards after obtaining all 4 Daily Commission Rewards every day.
 Adjusts the "Exit Challenge" interface in the "Test Run" event and adds the "Other Trial Stages" option.
 Adjusts the "Mystic Offering" interface to support the display of the corresponding Artifacts' 2-Piece Set and 4-Piece Set effects.
 Adjusts the source descriptions of Character Ascension Materials and adds a shortcut to "Adventurer Handbook > Domains."
 Adjusts certain button texts in the "Artifacts Filter" and "Artifact Auto-Lock" interfaces.

 ● Audio
 Adds a voice-over trigger scenario: Related voice-overs will be triggered the first time you obtain a character and view their character portrait, as well as the first time you obtain a character's outfit and view their character outfit portrait.
 Optimizes the "Character/Ascension" screen so that characters' idle voice-overs now stop completely after being interrupted by Ascension voice-overs.
 Optimizes the Korean voice-overs for certain characters and quests.

 ● Other
 If related achievements of a Commission Quest are not unlocked yet, the probability of that Commission Quest appearing will increase.
 The "Dynamic Character Resolution" feature has been added for PlayStation® and some PC devices. This will be activated by default on PlayStation® and no option will be shown. On PCs that support this feature, you will be able to find and enable "Dynamic Character Resolution" in Settings > Graphics (this option will not be shown on PCs that currently do not support it).
 The text descriptions of some achievements have been fixed (the corresponding Achievement Trophies on PlayStation® cannot be modified currently).
 After the Version 4.4 update, new UID naming rules will be used for newly registered accounts on the Asia server (existing account UIDs will be unaffected).

 〓Genius Invokation TCG Balance Adjustment〓
 Adjusts the effect of the Event Card "In Every House a Stove" to the following: Draw a number of cards equal to the current Round number minus 1. (Up to 4 cards can be drawn in this way).
 Adjusts the effect of the Equipment Card "Vourukasha's Glow": Only after triggering its "draw 1 card" effect, its other effect "heal the attached character for 1 HP" can take effect in that same Round.
 Adjusts the effect of the status "Lightning Rod" for the Character Card "Thunder Manifestation": The effect "While this status is active, can be triggered once: DMG received by the attached character from Thunder Manifestation or its summons is increased by 1." has been adjusted to "When the attached character takes DMG from Thunder Manifestation or its summons: Remove this state, cause this DMG instance to increase by 1."
 Adjusts the Elemental Dice cost of the Talent Card "Grieving Echo" for the Character Card "Thunder Manifestation", and adds effects: The number of dice required has increased from 0 Electro Dice to 3, and adds the effects "Combat Action: When your active character is Thunder Manifestation, equip this card." as well as "After Thunder Manifestation equips this card, immediately use Strifeful Lightning once."

 〓Bug Fixes〓
 ● Enemies
 Fixes an issue whereby, when the enemy "Black Serpent Knight" was defeated, the defeat animation would not play properly in certain situations.
 Fixes an issue whereby, when the enemy "Armored Crab" was hit by Chevreuse's Elemental Burst, it would remain suspended in mid-air for an unusually long time in certain situations.
 Fixes an issue whereby, when different Pneuma- or Ousia-aligned enemies were overloaded at the same time, there was a chance that the enemy "Arithmetic Enhancer Mek" would fail to remove its teammates' Deactivated statuses as it should do.

 ● Character
 Fixes an issue whereby when Lyney approached opponents after turning into a Grin-Malkin Cat with his Elemental Burst, there was a small chance that he would deal an additional instance of DMG to the same opponent.
 Fixes an issue with the Traveler (Hydro) whereby, when the Sourcewater Droplets produced by casting their Elemental Skill were absorbed, a special effect would abnormally remain.
 Fixes an issue whereby, when Sayu and Furina were in the same party, there was a chance that Sayu's Passive Talent "Yoohoo Art: Silencer's Secret" would abnormally fail to take effect.

 ● System
 Fixes an issue in the "Adventurer Handbook > Commissions" interface whereby despite still lacking an extremely tiny amount of Encounter Points, it would suggest there were already enough to claim the rewards.
 Fixes an issue whereby the in-game camera would work abnormally when the character used the drive valve in the Fortress of Meropide: Abandoned Production Zone under certain circumstances.
 Fixes an issue whereby the special effects of the All-Devouring Narwhal would display abnormally in the Living Beings section of the Archive after the Version 4.3 update.
 Fixes an issue with Artifacts with 1-Piece Set effect whereby the 1-Piece Set effect would display abnormally as activated without being equipped.
 Removes redundant scene objects under certain lower graphics quality settings.

 ● Genius Invokation TCG
 Fixes an issue with the Character Card "Cryo Cicin Mage" whereby while using her Elemental Burst, if she took DMG from triggering "Sparks 'n' Splash," "Fatui Ambusher," and other Combat Statuses, the Shield Points of her Flowing Cicin Shield generated by the Cryo Cicins would be incorrect.
 Fixes an issue with the Character Card "Layla" whereby the Combat Status "Curtain of Slumber Shield" created by her Elemental Skill lacked the "Shield" tag.
 Fixes an issue during challenges whereby, when cards imbued with either Pneuma or Ousia energy became Deactivated after casting skills that needed to be prepared, the statuses of these skills would abnormally remain.
 Fixes an issue whereby, when the Character Card "Alhaitham" had the Status "Chisel-Light Mirror" attached, the text description for the character's Normal Attack abnormally failed to state that DMG inflicted would be Dendro DMG (this was purely a textual error as the actual effect was working properly).

 ● Audio
 Fixes an issue whereby there would be abnormal background noises when enhancing Artifacts.
 Fixes grammar mistakes and errors with the Chinese voice-overs for certain characters and quests.
 Fixes an issue whereby Kuki Shinobu and Navia's Korean chat voice-overs did not match their actual idle animations.

 ● Other
 Fixes an issue in Co-Op Mode whereby the host couldn't use the Xenochromatic Ball Octopus's ability to interact with targets under certain circumstances.
 Fixes an issue in Co-Op Mode whereby Leisurely Otter (Wildlife) could abnormally swim above the water surface under certain circumstances.
 Fixes an issue with Hydro Crystalflies in Fontaine's underwater areas whereby there was a chance that they didn't appear or they got startled before the character approached close enough.
 Fixes an issue in the Serenitea Pot whereby the "Invite" button of the Gift Set "Full Force Forward in the Forbidden Fortress" was being abnormally obstructed by the furnishing model.
 Fixes an issue whereby, when using a controller to interact with the gadget "Crystalfly Trap" or "Parametric Transformer," the screen for converting Genesis Crystals into Primogems would be abnormally opened in certain situations.
 Fixes some text errors in certain languages and optimizes text. (Note: Related in-game functions have not changed. Travelers can view the changes in different languages by going to the Paimon Menu > Settings > Language and changing the Game Language.)
 Text-related fixes and optimizations in English include:
 ◆ Optimizes inconsistencies between certain voice-overs and the corresponding lines in the Version 4.2 Archon Quest.
 ◆ Optimizes certain translations on the Artifact Auto-Lock screen.


 *This is a work of fiction and is not related to any actual people, events, groups, or organizations.
 "PlayStation", "PS5", "PS4", "DualSense", "DUALSHOCK" are registered trademarks or trademarks of Sony Interactive Entertainment Inc.


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/30/b04dfd10996b5d573ec41ddd060f1298_8615352638195330319.jpg
- Event Duration: undefined
Version Details - What's New
- Subtitle: Update Summary
- ID: 20348
- Description: Dear Travelers:
 To ensure that all Travelers have the best-possible Genshin Impact experience, our developers continually make optimizations and bug fixes to the game based on Travelers' feedback.

 〓Known Issues〓
 There is an issue whereby after the character leaves the water droplet of "Golden Carp's Leap," there is a small probability of encountering abnormalities such as the disappearance of the Elemental Skill, Elemental Burst, and Sprint buttons, inability to switch parties, and the appearance of the crosshair at the center of the screen.
 Travelers who experience this issue can try to interact with the water droplet of "Golden Carp's Leap" again, or exit the game via the Paimon Menu before logging in again as a temporary fix. If the issue persists, Travelers can report the issue through the Feedback tab in the Paimon Menu.
 After the Version 4.4 update, iOS devices that support the MetalFX graphics setting in the game may encounter the issue of the setting option disappearing, and the settings not taking effect. This issue will be fixed in a future update.

 〓2024/02/07 17:20 Update Details〓
 Fixes an issue whereby a challenge located in Chenyu Vale: Southern Mountain could not be completed under certain circumstances.
 Fixes an issue whereby after purifying the miasma, if the treasure chest remained uncollected, the opponents at the corresponding location would not reappear the next day under certain circumstances.
 Fixes an issue whereby the afterimage special effect during Xiao's Elemental Burst would appear abnormally after the Version 4.4 update.

 〓2024/02/05 17:10 Update Details〓
 Fixes an issue with bow-wielding characters whereby after experiencing certain gameplay in Chenyu Vale, there was a chance for their arrows to be positioned incorrectly, making it difficult to hit targets.

 ▌ Compensation Details
 Primogems ×100

 ▌ Eligibility
 Travelers who reached Adventure Rank 5 and above before 2024/02/05 17:00.
 Please log in between 2024/02/06 17:00 and 2024/02/09 17:00 to receive your compensation. The mail will expire after 30 days, so don't forget to claim the attached compensation in time.

 〓2024/02/02 15:50 Update Details〓
 Fixes an issue whereby, after interacting with the "Golden Carp's Leap" pearls, there was a small chance that characters would remain floating in the air and be unable to move under certain circumstances.
 Fixes an issue whereby, when characters lit up censers during the "Jade Incense Cauldron" challenge, voice-overs and other mechanisms would be triggered abnormally.
 Fixes an issue whereby, after Ganyu's outfit was switched to "Twilight Blossom," there would be some slight abnormalities with her character animation after unleashing her Elemental Skill.
 Fixes an issue whereby under certain circumstances, the red dot for "Exploding Population" in the "Events Overview" interface is unable to be removed after the Version 4.4 update.

 〓2024/02/01 15:55 Update Details〓
 Fixes an issue with Ganyu whereby, after switching to the "Twilight Blossom" outfit and casting her Elemental Skill, there was a small chance that Frostflake Arrows fired by the character's Charged Attacks would be positioned incorrectly.

 ▌ Compensation Details
 Primogems ×100

 ▌ Eligibility
 Travelers who reached Adventure Rank 5 and above before 2024/02/01 17:00.
 Please log in between 2024/02/02 17:00 and 2024/02/05 17:00 to receive your compensation. The mail will expire after 30 days, so don't forget to claim the attached compensation in time.

 Fixes an issue with Shenhe whereby, after switching to the "Frostflower Dew" outfit, the character's expression would be abnormal when unleashing her Elemental Burst.
 Fixes an issue whereby there is an error in the display art of Character Outfit "Frostflower Dew" in "Shop > Recommended."
 Adds compatibility for Samsung Exynos 2400 devices.
 Fixes an issue whereby, during the World Quest "An Ancient Sacrifice of Sacred Brocade," there was a small chance that the quest objective "Collect the Spirit Orb" could not be completed when the network connection was poor. If you encounter this issue, please exit the game from the Paimon Menu and log in again to resolve it.

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/announcement/2020/11/11/0c4d0c742dde8334be30352fa3f5fb5b_4067277611421326976.jpg
- Event Duration: undefined
Web Event "Dancing Beasts and Soaring Kites" Now Online: Take Part to Obtain Primogems and Other In-Game Rewards
- Subtitle: Web Event "Dancing Beasts and Soaring Kites" Now Online: Take Part to Obtain Primogems and Other In-Game Rewards
- ID: 20317
- Description: Dancing beasts to wave in the new, and soaring kites for blessings too!
 The Lantern Rite is here, bringing happiness, prosperity, and good fortune~

 >> Click to Take Part in Event <<

 〓Event Duration〓
 2024/02/08 – 2024/02/18 00:59
 *Rewards cannot be claimed after the event ends. Please claim them in time.

 〓Eligibility〓
 Travelers who have reached Adventure Rank 10 or above can participate in this event.

 〓Event Description〓
 During the event, you can log in to Genshin Impact daily, claim Commission Rewards, consume Original Resin, and complete other missions to obtain the event item: Pale Yellow Silk Paper.
 Pale Yellow Silk Paper can be used to unlock the various sections of the event and to search for the correct options. Once you choose the correct option, you'll be able to obtain Primogems and other in-game rewards.

 〓Event Details〓
 You can obtain the event item: Pale Yellow Silk Paper through the following methods: Complete missions such as logging into Genshin Impact every day, claiming Commission Rewards 2 times daily, and using a total of 40 Original Resin daily to obtain the corresponding amount of Pale Yellow Silk Paper.
 Daily missions refresh at 04:00 (Server Time) each day. Unclaimed Pale Yellow Silk Paper will also be cleared by then. Please claim and use it in time. Claimed Pale Yellow Silk Paper will not be cleared.
 A certain amount of Pale Yellow Silk Paper can be used to unlock different sections. There are a total of 5 sections in the event, each of which is on a different stage. You can click the Suanni and Crane buttons on the home page to switch between different stages and enter the corresponding sections.
 After unlocking a section, you can play it multiple times until you've selected the correct option to obtain in-game rewards.
 In each section, there are a total of three options to choose from. After you've chosen an option, you can flip it over to see the companion or item hidden behind.
 Once you've flipped over the correct option, you'll have completed the challenge and will be able to obtain in-game rewards. If you flip over the wrong one, the companion or item behind will stay on the stage. You can continue flipping over the remaining options until you've selected the correct one in order to obtain in-game rewards.
 If you leave halfway through, your progress will not be saved but your Pale Yellow Silk Paper will not be consumed either. You can try again multiple times.

 *If Travelers try to visit the event at around 04:00 (Server Time), which is when the daily missions refresh, they may encounter a brief network error. Please refresh the page if you encounter this error.

 〓Event Rewards〓
 After you've unlocked all of the sections and completed the challenges, you'll be able to obtain Primogems ×120, Mystic Enhancement Ore ×10, Hero's Wit ×10, and Mora ×70,000. Also, after completing three sections and their challenges, you'll obtain a special reward: the blueprint for the Serenitea Pot Furnishing "Valley Store: The Leisure of Tea."

 *The in-game rewards will be distributed via in-game mail. The mail will expire after 30 days, so don't forget to claim the rewards in time.

 *This web event is provided purely for entertainment. It is not indicative of any related gameplay features in Genshin Impact.


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/02/02/1447c8e73a8120123f2167711370e653_8346111948165236056.png
- Event Duration: 2024/02/08 – 2024/02/18 00:59
*Rewards cannot be claimed after the event ends. Please claim them in time.

The Lantern Rite Discussion Event Has Begun! Take Part to Win Primogems and Obtain Mora Rewards
- Subtitle: The Lantern Rite Discussion Event Has Begun! Take Part for Guaranteed Rewards
- ID: 20312
- Description: Dear Travelers,
 The HoYoLAB Community Forum Commenting Event has begun! Take part in the discussion to obtain Mora ×50,000 and get a chance to win one of 5,000 Primogem prizes!

 Take Part in the Event >>

 Event Duration
 2024/02/02 – 2024/02/19 00:59

 Event Theme
 If you could travel to Liyue, who would you like to hang out with, and what would you do? Feel free to use your imagination and share your idea of what the perfect Lantern Rite night would be like~

 Event Rewards
 Guaranteed: Join the discussion for a guaranteed Mora ×50,000 as well as a Lantern Rite-Exclusive Dynamic Avatar Frame (Permanent)
 Raffle: 5,000 winners will be randomly chosen to receive Primogems ×100!


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/25/3906d337a272bad5c6de08ba0fde0ae5_2007144783209808433.jpg
- Event Duration: undefined
HoYoLAB Community "Daily Check-In" Feature
- Subtitle: Daily Check-In Feature
- ID: 20346
- Description: Dear Travelers,
 The HoYoLAB Community "Daily Check-In" feature is now available!
 Click here to access the feature

 Go to HoYoLAB > Tools > Genshin Impact > Check-in, and check in daily to obtain Primogems, Mora, Hero's Wit, and other in-game rewards.
 You will receive 100 Primogems and 10,000 Mora for your first check-in!

 〓Event Duration〓
 Permanent

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2022/12/06/d15f6c61e1d3d62d5e269360aaef7285_3515093605882829658.png
- Event Duration: Permanent

View the Updated Interactive Map, Battle Chronicle, and Other Tools!
- Subtitle: The Genshin Impact Version 4.4 Tools Update Is Here!
- ID: 20300
- Description: Dear Travelers,
 Genshin Impact Version 4.4 is here, heralding not only the return of the annual Lantern Rite, but also the arrival of two new characters: Xianyun and Gaming! Genshin Impact's tools in HoYoLAB have also been updated with a load of new content to help you on your journey through Version 4.4. Let's take a look~

 | Teyvat Interactive Map Update: Adds recommended Ascension Material harvest routes for Xianyun and Gaming.
 Teyvat Interactive Map Pins now support redirecting to HoYoWiki entries from their details pages.
 Recommended Ascension Material harvest routes for the new characters Xianyun and Gaming have been added too, so come check them out~
 >> Click to View the Teyvat Interactive Map <<

 | Battle Chronicle Update: Chenyu Vale has been added to the World Exploration details page
 Travelers can view their Offering Level and Exploration Progress for different areas within the new region in the World Exploration module.
 With the arrival of Version 4.4's new event in Liyue, "Vibrant Harriers Aloft in Spring Breeze," the Battle Chronicle will also be updated so you can view your event records in the Event Review module.
 >> Click to View Battle Chronicle <<

 | Enhancement Progression Calculator Update: Supports calculating level-up materials for the new characters Xianyun and Gaming.
 >> Click to Use the Enhancement Progression Calculator <<

 | Lineup Simulator Update: Supports related lineup queries and posts for the new characters Xianyun and Gaming.
 >> Click to Use the Lineup Simulator <<

 | Card Plaza Update: Adds the Character Cards Thoma and Sayu, as well as a variety of Action Cards.
 >> Click to Enter the Card Plaza <<


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/31/de591f39f2c0619526d7aea65062ef18_4659961550007791681.png
- Event Duration: undefined
Primogems Event: The Lantern Rite Fan Art Contest Has Begun!
- Subtitle: Lantern Rite Fan Art Contest Now Available
- ID: 20313
- Description: Dear Travelers,
 The HoYoLAB Community Fan Art Contest has begun! Take part for a chance to win up to Primogems ×10,000!

 Take Part in the Event >>

 Event Duration
 2024/01/31 – 2024/02/28 00:59

 How to Participate
 The contest will have two separate tracks, "HoYoLAB Avatar Frames" and "HoYoLAB Comment Decorations." Submissions must be related to the "Lantern Rite" theme, but there are no restrictions on the specific creative direction.

 Event Rewards
 First Prize (5 Winners): Primogems ×10,000
 Second Prize (10 Winners): Primogems ×5,000
 Third Prize (15 Winners): Primogems ×3,000
 Popularity Prize (30 Winners): Primogems ×1,000
 Lucky Prize (300 Winners): Primogems ×300
 Participation Prize (quantity not fixed): "Unusual Hilichurl" Comment Decoration (90 days)

 Additionally, 10 works will be chosen to become officially available on HoYoLAB based on their popularity (likes + replies to comments) and overall quality! We're looking forward to seeing everyone's submissions~


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/25/c1a7cfe23d7b58b38a1f67bf332416f8_8989086779376349977.jpg
- Event Duration: undefined
Game Survey
- Subtitle: Complete the Survey and Get Primogems
- ID: 3770
- Description: Dear Travelers,
 A new adventure has begun! In order to better understand the gaming habits of Travelers and to bring them the best-possible Genshin Impact experience, Paimon has prepared a survey. Travelers who complete the survey will receive Primogems ×50~

 〓Survey Period〓
 Long-term

 〓Survey Link〓
 Click here to fill out the survey.

 Travelers can also open the link via Paimon Menu > Mail > Game Survey > Survey Link to access the survey or via Paimon Menu > Survey > Select "Game Survey" to fill out the survey. After completing filling out the survey through any of the steps, you will get a prize, and you don't need to fill it in again~
 Survey answers cannot be changed after submission, so please fill it out carefully.

 We thank all Travelers for your invaluable feedback!

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/announcement/2022/08/17/f8c479b1eaf9c19328c56264ca38affe_8815493962934825777.jpg
- Event Duration: undefined
Details of the Feedback on Special Categories Function
- Subtitle: Feedback on Special Categories
- ID: 2871
- Description: Dear Travelers,
 To enhance everyone's game experience, the team has opened a new channel for "Feedback on Special Categories." Travelers can send their opinions and suggestions through this channel, and we will listen carefully to your feedback.
 At the same time, we will update the content of our different surveys regularly to collect your various suggestions on our new content~

 〓Enter Feedback〓
 Click Here to Fill Out
 Or open the Paimon Menu, click on the "Feedback" button to enter "Feedback on Special Categories" to fill out the survey.

 〓Duration〓
 Permanently Available

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/announcement/2022/02/23/4d8d8305686aec10047dc3341b583bac_6183272339246996881.jpg
- Event Duration: Permanently Available

HoYoLAB Community - Genshin Impact Exclusive Tools Overview
- Subtitle: Genshin Impact Exclusive Tools Overview
- ID: 2795
- Description: To enhance the adventuring experience in Teyvat, the HoYoLAB community has prepared exclusive travel tools for Travelers. They are as follows:

 1. Daily Check-In
 Check in daily to get Primogems, Mora, and other in-game items. The first time you check in will also grant you an additional Primogems ×100 and Mora ×10,000!
 View Location:
 HoYoLAB > Tools > Genshin Impact > Check-In

 2. Battle Chronicle
 You will be able to see your game exploration statistics with a single click, allowing you to quickly view in-game information regarding character details, the Abyss Spiral, World Exploration, and Version events!
 View Location:
 HoYoLAB > Tools > Genshin Impact > Battle Chronicle

 3. Teyvat Interactive Map
 You can find target resources on the map and plan your route at any time.
 View Location:
 HoYoLAB > Tools > Genshin Impact > Teyvat Interactive Map

 4. Traveler's Diary
 You can check the amount of Primogems and Mora that you have obtained monthly since you began playing the game in the Traveler's Diary, along with details about where or how you obtained them.
 View Location:
 HoYoLAB > Tools > Genshin Impact > Traveler's Diary

 5. Enhancement Progression Calculator
 You can use the Enhancement Progression Calculator to calculate the resources required to build characters, artifacts, weapons, and furnishings.
 View Location:
 HoYoLAB > Tools > Genshin Impact > Enhancement Progression Calculator

 6. Lineup Simulator
 You can use the Lineup Simulator to find and publish detailed lineup recommendations regarding the Spiral Abyss and World Exploration.
 View Location:
 HoYoLAB > Tools > Genshin Impact > Lineup Simulator

 7. Card Plaza
 You can browse for popular decks with a click, easily master the characteristics of specific cards and decks, and publish your own decks as well.
 View Location:
 HoYoLAB > Tools > Genshin Impact > Card Plaza

 Some of the above tools must be used in the HoYoLAB App. More specific details about the exclusive tools are described below:
 >>Click to learn more details about the Tools<<

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2023/05/23/ca52254dfa3b189a219100fe58bc0e20_4310229147167924893.jpg
- Event Duration: undefined
Official Top-Up Center Now Online
- Subtitle: Online Top-Up Center
- ID: 1249
- Description: Dear Travelers, the official Top-Up Center is now available on the Genshin Impact website. Interested Travelers can check it out by following the link below to the website.
 Go to Website
  
 From the homepage, simply select the "Top Up" button at the top of the page to access the Top Up Center.Before making any payments, please check that the UID you are topping up matches your account. (You can check your UID in-game by opening the Paimon Menu.) When topping up a UID, any purchases will be automatically applied to the corresponding game account.Travelers are advised that there may be a delay between topping up and receiving the items in-game.
 If you have any questions about topping up, please send us an email at genshin_payment@hoyoverse.com
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2022/12/06/a3f64d19df0a6a8ed5a3b0a1fccba620_3384464103647206496.jpg
- Event Duration: undefined
Genshin Impact Traveler Community
- Subtitle: Genshin Impact Traveler Community
- ID: 1250
- Description: 〓HoYoLAB - Official Community〓
 Teyvat Adventure Assistant
 Daily check-in rewards, interactive map, Wiki, quality guides... You'll find everything you need here!
 HoYoLAB Community

 Click to Download the HoYoLAB App

 〓Official Site〓
 Official Site

 〓Official Social Media〓
 Official Discord

 Official Facebook

 Official Twitter

 Official YouTube

 Official Twitch

 Official Reddit

 〓Customer Service〓
 genshin_cs@hoyoverse.com
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/announcement/2020/09/22/cdd9728d92166c341cc4a8fdfa786056_4263317197346022378.jpg
- Event Duration: undefined
Genshin Impact - Fair Use Statement
- Subtitle: Fair Use Statement
- ID: 1251
- Description: To ensure a fair and healthy Genshin Impact gaming environment and offer Travelers a great gaming experience, we would like to remind everyone that the following rules apply to all Travelers at all times:
 1) The use of plug-ins, accelerators, and any other third-party tools that affect the fairness of the game is strictly forbidden.COGNOSPHERE PTE. LTD. (herein referred to as "we") will respond to any such activity by taking measures including but not limited to removal of inappropriately obtained rewards, suspension of accounts, and permanent banning of accounts, with the precise measures to be decided based on the seriousness and number of violations.
  
 2) The sale, purchase, or transfer of accounts by any means is strictly forbidden.We urge Travelers to protect their personal property and information, ignore any requests for account sharing or trading, and refrain from purchasing accounts on other platforms. Likewise, Travelers are forbidden from sharing or selling their own account.In accordance with Genshin Impact's Terms of Service, we will not be responsible for any personal information leaks or damages resulting from a Traveler's own actions.
 Genshin Impact's Terms of Service

 3) Top-up via non-official channels and third parties is strictly forbidden.We will respond to any such activity by taking measures including but not limited to removal of inappropriately obtained rewards, suspension of accounts, and permanent banning of accounts, with the precise measures to be decided based on the seriousness and number of violations.
 We are committed to guaranteeing the fair gameplay of Genshin Impact and to safeguarding Travelers' in-game assets. As we endeavor to constantly improve Genshin Impact, we wholeheartedly hope that Travelers join us in creating and maintaining a fair and harmonious gaming environment.
  
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/announcement/2020/09/17/a200f1d4c84be88961455023b264a0bb_3936625726356517613.jpg
- Event Duration: undefined
Event Wish "The Crane Soars Skyward" - Boosted Drop Rate for "Passerine Herald" Xianyun (Anemo)!
- Subtitle: Event Wish - The Crane Soars Skyward
- ID: 20268
- Description: Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Character (5-Star)
 Featured Characters (4-Star)
 After the Version 4.4 update
 —
 2024/02/20 18:59
 "Passerine Herald" Xianyun (Anemo)
 "Leonine Vanguard" Gaming (Pyro)
 "Enigmatic Machinist" Faruzan (Anemo)
 "Chivalric Blossom" Noelle (Geo)
 ● During this event wish, the event-exclusive 5-star character "Passerine Herald" Xianyun (Anemo) will receive a huge drop-rate boost!
 ● During this event, the 4-star characters "Leonine Vanguard" Gaming (Pyro), "Enigmatic Machinist" Faruzan (Anemo), and "Chivalric Blossom" Noelle (Geo) will receive a huge drop-rate boost!
 ● After this event wish ends, the 4-star character "Leonine Vanguard" Gaming (Pyro) will be available in the standard wish "Wanderlust Invocation" in the next Version.
 ※ Of the above characters, the event-exclusive character will not be available in the standard wish "Wanderlust Invocation."
 ※ This is for "Character Event Wish." The wish guarantee count for "Character Event Wish" and "Character Event Wish-2" is shared, and is accumulated between both "Character Event Wish" and "Character Event Wish-2." This wish guarantee count is independent of the guarantee counts of other types of wishes.
 ※ The "Test Run" trial event will be open during this event wish. Travelers may use fixed lineups containing the selected trial characters to enter specific stages and test them out. Travelers that complete the challenges will receive the corresponding rewards!
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/8a42705ce459e44aaae3f345ff624a53_5120958252254257516.png
- Event Duration: After the Version 4.4 update — 2024/02/20 18:59
Event Wish "The Moongrass' Enlightenment" - Boosted Drop Rate for "Physic of Purity" Nahida (Dendro)!
- Subtitle: Event Wish - The Moongrass' Enlightenment
- ID: 20269
- Description: Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Character (5-Star)
 Featured Characters (4-Star)
 After the Version 4.4 update
 —
 2024/02/20 18:59
 "Physic of Purity" Nahida (Dendro)
 "Leonine Vanguard" Gaming (Pyro)
 "Enigmatic Machinist" Faruzan (Anemo)
 "Chivalric Blossom" Noelle (Geo)
 ● During this event wish, the event-exclusive 5-star character "Physic of Purity" Nahida (Dendro) will receive a huge drop-rate boost!
 ● During this event, the 4-star characters "Leonine Vanguard" Gaming (Pyro), "Enigmatic Machinist" Faruzan (Anemo), and "Chivalric Blossom" Noelle (Geo) will receive a huge drop-rate boost!
 ● After this event wish ends, the 4-star character "Leonine Vanguard" Gaming (Pyro) will be available in the standard wish "Wanderlust Invocation" in the next Version.
 ※ Of the above characters, the event-exclusive character will not be available in the standard wish "Wanderlust Invocation."
 ※ This is for "Character Event Wish-2." The wish guarantee count for "Character Event Wish" and "Character Event Wish-2" is shared, and is accumulated between both "Character Event Wish" and "Character Event Wish-2." This wish guarantee count is independent of the guarantee counts of other types of wishes.
 ※ The "Test Run" trial event will be open during this event wish. Travelers may use fixed lineups containing the selected trial characters to enter specific stages and test them out. Travelers that complete the challenges will receive the corresponding rewards!
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/d02d3cde6b1944a0ef375c0662655f2a_556478261796841791.png
- Event Duration: After the Version 4.4 update — 2024/02/20 18:59
Event Wish "Epitome Invocation" - Boosted Drop Rate for Crane's Echoing Call (Catalyst) and A Thousand Floating Dreams (Catalyst)!
- Subtitle: Event Wish - Epitome Invocation
- ID: 20270
- Description: Travelers, stock up on weapons and characters in "Epitome Invocation" to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Weapons (5-Star)
 Featured Weapons (4-Star)
 After the Version 4.4 update
 —
 2024/02/20 18:59
 Crane's Echoing Call (Catalyst)
  
 A Thousand Floating Dreams (Catalyst)
 Lithic Spear (Polearm)
 Sacrificial Sword (Sword)
 Sacrificial Greatsword (Claymore)
 Sacrificial Fragments (Catalyst)
 Sacrificial Bow (Bow)
 ● During the event wish, the event-exclusive 5-star weapons Crane's Echoing Call (Catalyst) and A Thousand Floating Dreams (Catalyst) will receive a huge drop-rate boost!
 ● During the event wish, the event-exclusive 4-star weapon Lithic Spear (Polearm) as well as the 4-star weapons Sacrificial Sword (Sword), Sacrificial Greatsword (Claymore), Sacrificial Fragments (Catalyst), and Sacrificial Bow (Bow) will receive a huge drop-rate boost!
 ● During the event wish, use Epitomized Path to chart a course towards a promotional 5-star weapon, such as Crane's Echoing Call (Catalyst) or A Thousand Floating Dreams (Catalyst). For more information on Epitomized Path, go to the Wish screen and select Details in the bottom-left corner.
 ※ Of the above weapons, the event-exclusive weapons will not be available in the standard wish "Wanderlust Invocation."
  
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/f1b276f8df146b46e85efb9f3b595dd4_8718989072003631333.png
- Event Duration: After the Version 4.4 update — 2024/02/20 18:59
Event Wish "Invitation to Mundane Life" - Boosted Drop Rate for "Vigilant Yaksha" Xiao (Anemo)!
- Subtitle: Event Wish - Invitation to Mundane Life
- ID: 20281
- Description: Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Character (5-Star)
 Featured Characters (4-Star)
 2024/02/20 19:00
 —
 2024/03/12 15:59
 "Vigilant Yaksha" Xiao (Anemo)
 "Burgeoning Grace" Yaoyao (Dendro)
 "Blazing Riff" Xinyan (Pyro)
 "Eclipsing Star" Ningguang (Geo)
 ● During this event wish, the event-exclusive 5-star character "Vigilant Yaksha" Xiao (Anemo) will receive a huge drop-rate boost!
 ● During this event wish, the 4-star characters "Burgeoning Grace" Yaoyao (Dendro), "Blazing Riff" Xinyan (Pyro), and "Eclipsing Star" Ningguang (Geo) will receive a huge drop-rate boost!
 ※ Of the above characters, the event-exclusive character will not be available in the standard wish "Wanderlust Invocation."
 ※ This is for "Character Event Wish." The wish guarantee count for "Character Event Wish" and "Character Event Wish-2" is shared, and is accumulated between both "Character Event Wish" and "Character Event Wish-2." This wish guarantee count is independent of the guarantee counts of other types of wishes.
 ※ The "Test Run" trial event will be open during this event wish. Travelers may use fixed lineups containing the selected trial characters to enter specific stages and test them out. Travelers that complete the challenges will receive the corresponding rewards!
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/365cb4e555b8a4ae8aa8870c919fc65f_5593508916197708458.png
- Event start: Tue Feb 20 2024 19:00:00 GMT+0900
- Event end: Tue Mar 12 2024 15:59:00 GMT+0900
Event Wish "Everbloom Violet" - Boosted Drop Rate for "Astute Amusement" Yae Miko (Electro)!
- Subtitle: Event Wish - Everbloom Violet
- ID: 20282
- Description: Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Character (5-Star)
 Featured Characters (4-Star)
 2024/02/20 19:00
 —
 2024/03/12 15:59
 "Astute Amusement" Yae Miko (Electro)
 "Burgeoning Grace" Yaoyao (Dendro)
 "Blazing Riff" Xinyan (Pyro)
 "Eclipsing Star" Ningguang (Geo)
 ● During this event wish, the event-exclusive 5-star character "Astute Amusement" Yae Miko (Electro) will receive a huge drop-rate boost!
 ● During this event wish, the 4-star characters "Burgeoning Grace" Yaoyao (Dendro), "Blazing Riff" Xinyan (Pyro), and "Eclipsing Star" Ningguang (Geo) will receive a huge drop-rate boost!
 ※ Of the above characters, the event-exclusive character will not be available in the standard wish "Wanderlust Invocation."
 ※ This is for "Character Event Wish-2." The wish guarantee count for "Character Event Wish" and "Character Event Wish-2" is shared, and is accumulated between both "Character Event Wish" and "Character Event Wish-2." This wish guarantee count is independent of the guarantee counts of other types of wishes.
 ※ The "Test Run" trial event will be open during this event wish. Travelers may use fixed lineups containing the selected trial characters to enter specific stages and test them out. Travelers that complete the challenges will receive the corresponding rewards!
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/51d1b688a18a785590c20a55a73b438d_6763879702561442814.png
- Event start: Tue Feb 20 2024 19:00:00 GMT+0900
- Event end: Tue Mar 12 2024 15:59:00 GMT+0900
Event Wish "Epitome Invocation" - Boosted Drop Rate for Kagura's Verity (Catalyst) and Primordial Jade Winged-Spear (Polearm)!
- Subtitle: Event Wish - Epitome Invocation
- ID: 20283
- Description: Travelers, stock up on weapons and characters in "Epitome Invocation" to make your party stronger in combat!
  
 〓Event Wish Details〓
 Event Wish Duration
 Promotional Weapons (5-Star)
 Featured Weapons (4-Star)
 2024/02/20 19:00
 —
 2024/03/12 15:59
 Kagura's Verity (Catalyst)
  
 Primordial Jade Winged-Spear (Polearm)
 Lithic Blade (Claymore)
 Lion's Roar (Sword)
 Favonius Lance (Polearm)
 The Widsith (Catalyst)
 The Stringless (Bow)
 ● During the event wish, the event-exclusive 5-star weapon Kagura's Verity (Catalyst) and the 5-star weapon Primordial Jade Winged-Spear (Polearm) will receive a huge drop-rate boost!
 ● During the event wish, the event-exclusive 4-star weapon Lithic Blade (Claymore) as well as the 4-star weapons Lion's Roar (Sword), Favonius Lance (Polearm), The Widsith (Catalyst), and The Stringless (Bow) will receive a huge drop-rate boost!
 ● During the event wish, use Epitomized Path to chart a course towards a promotional 5-star weapon, such as Kagura's Verity (Catalyst) or Primordial Jade Winged-Spear (Polearm). For more information on Epitomized Path, go to the Wish screen and select Details in the bottom-left corner.
 ※ Of the above weapons, the event-exclusive weapons will not be available in the standard wish "Wanderlust Invocation."
  
 ※ For more information, go to the Wish screen and select Details in the bottom-left corner.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/1284ac30880f109349117b26a5d36653_2259021118438069973.png
- Event start: Tue Feb 20 2024 19:00:00 GMT+0900
- Event end: Tue Mar 12 2024 15:59:00 GMT+0900
"Grus Serena Chapter" Story Quest Overview
- Subtitle: Grus Serena Chapter
- ID: 20271
- Description: Travelers who reach the required Adventure Rank and complete the prerequisite quests will be able to use a Story Key to unlock Xianyun's Story Quest "Grus Serena Chapter."
 The Story Quest feature is unlocked at Adventure Rank 26. Story Keys are obtained by claiming Daily Commission rewards (one Story Key is awarded for every eight Daily Commission rewards claimed).
  
 〓Quest Start Time〓
 Permanently available after the Version 4.4 update
  
 〓Quest Unlock Criteria〓
 Adventure Rank 40 or above
 Complete Archon Quest Interlude Chapter: Act I "The Crane Returns on the Wind"
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/aeef0f3921ff19b5557dafbf41d1c116_4725924426488503884.png
- Event Duration: Permanently available after the Version 4.4 update
 
"Vivid Flight" Event Details
- Subtitle: Vivid Flight
- ID: 20272
- Description: Travelers can earn rich rewards in "Vivid Flight" during the event duration. Unlock "Gnostic Hymn" or "Gnostic Chorus" to further earn Intertwined Fate and a designated 4-star weapon! Purchase "Gnostic Chorus" directly to get the exclusive BP namecard "Travel Notes: Vibrant Harriers" and Furnishing Blueprint "Artisanal Fish Lantern: Carp's Well."
  
 〓Event Duration〓
 After the Version 4.4 update – 2024/03/11 04:59
  
 〓Eligibility〓
 Adventure Rank 20 or above
  
 〓Event Details〓
 ● Sojourner's Battle Pass will be unlocked by default every BP Period. Travelers can also unlock either Gnostic Hymn or Gnostic Chorus in order to earn even more rewards, or directly purchase Gnostic Chorus at a discounted price.
 ※ Travelers who have already unlocked Gnostic Hymn need only exchange the remaining difference in cost through purchasing Travel Notes in order to unlock Gnostic Chorus.
 ※ The purchasing of Gnostic Hymn, Gnostic Chorus, and Travel Notes for this Battle Pass will end on 2024/03/11 03:59. Travelers can still complete Battle Pass Missions and claim rewards after the purchase period ends. Travelers, please take note of the purchase period and start time of the Battle Pass.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/b270e5c85a4017d34ee00fb167d63728_4714601541323551040.png
- Event Duration: After the Version 4.4 update – 2024/03/11 04:59
 
"Adventurer's Booster Bundles" - Round 29 Available for a Limited Time
- Subtitle: Adventurer's Booster Bundles
- ID: 20273
- Description: Round 29 of Adventurer's Booster Bundles is available for a limited time in the Shop!
  
 〓Adventurer's Instructional Bundle〓
 Duration: After the Version 4.4 update – 2024/02/15 00:59
 Purchase Requirements: Adventure Rank 25 or above
 Bundle Contents: Virtuous Share Bundle ×25, Mora ×150,000
 Bundle Price: Now 10% off for a limited time! The price after discount is 680 Genesis Crystals. Can be purchased up to three times in total.
 ※ Virtuous Share Bundle: After usage, you can select any one 3-star Talent Level-Up Material from all the options available in the current Version.
  
 〓Adventurer's Jumbo Ore Bundle〓
 Duration: After the Version 4.4 update – 2024/02/15 00:59
 Purchase Requirements: Adventure Rank 25 or above
 Bundle Contents: Mystic Enhancement Ore ×100, Mora ×100,000
 Bundle Price: Now 10% off for a limited time! The price after discount is 680 Genesis Crystals. Can be purchased up to five times in total.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/4ce7ec84377b12faa5c1e119d43e8dfd_2253981796156580055.png
- Event Duration: undefined
Shenhe's Outfit "Frostflower Dew" Available at a Limited-Time Discount
- Subtitle: Frostflower Dew
- ID: 20274
- Description: Shenhe's outfit "Frostflower Dew" is available at a limited-time discount in the Shop!
  
 〓Discount Period〓
 After the Version 4.4 update – 2024/03/11 04:59
  
 〓Outfit Details〓
 ● Shenhe's outfit "Frostflower Dew" will be permanently available in the Shop after the Version 4.4 update.
 ● The price of the outfit after discount is 1,350 Genesis Crystals. The price will revert to 1,680 Genesis Crystals after the limited-time discount ends. The outfit can only be purchased once.
 ● The outfit can be viewed in Character > Dressing Room > Outfit after purchase.
 ● Travelers who do not have Shenhe can still purchase the outfit, which can be viewed in the Character Archive after purchase.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/52e3520ae2a3c7071b8bb579c4b9a4c3_9088932271523509798.png
- Event Duration: undefined
Ganyu's Outfit "Twilight Blossom" Available at a Limited-Time Discount
- Subtitle: Twilight Blossom
- ID: 20275
- Description: Ganyu's outfit "Twilight Blossom" is available at a limited-time discount in the Shop!
  
 〓Discount Period〓
 After the Version 4.4 update – 2024/03/11 04:59
  
 〓Outfit Details〓
 ● Ganyu's outfit "Twilight Blossom" will be permanently available in the Shop after the Version 4.4 update.
 ● The price of the outfit after discount is 1,350 Genesis Crystals. The price will revert to 1,680 Genesis Crystals after the limited-time discount ends. The outfit can only be purchased once.
 ● The outfit can be viewed in Character > Dressing Room > Outfit after purchase.
 ● Travelers who do not have Ganyu can still purchase the outfit, which can be viewed in the Character Archive after purchase.
- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/1a760eb11ffec817223778e2e74b5b6d_2301650462265963577.png
- Event Duration: undefined
"May Fortune Find You" Daily Login Event
- Subtitle: May Fortune Find You
- ID: 20277
- Description: During the event, log in on 7 days in total to receive Intertwined Fate ×10 and other rewards!
  
 〓Event Duration〓
 2024/02/03 05:00 – 2024/02/18 04:59
  
 〓Eligibility〓
 Adventure Rank 5 or above
  
 〓Event Details〓
 Total Login Days
 Rewards
 1
 Intertwined Fate ×1
 2
 Mora ×80,000
 3
 Intertwined Fate ×2
 4
 Mystic Enhancement Ore ×18
 5
 Intertwined Fate ×2
 6
 Hero's Wit ×8
 7
 Intertwined Fate ×5

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/06237e280dabff3677319812c54c88a8_7898287072174034892.png
- Event start: Sat Feb 03 2024 05:00:00 GMT+0900
- Event end: Sun Feb 18 2024 04:59:00 GMT+0900
"Vibrant Harriers Aloft in Spring Breeze" Event: Take part to obtain Xingqiu's outfit and a 4-star character from Liyue of your choice
- Subtitle: Vibrant Harriers Aloft in Spring Breeze
- ID: 20278
- Description: 〓Event Duration〓
    Event Content
    Start Time 
 End Time
 Quest Duration
 Act I
 2024/02/05 11:00
 2024/02/26 04:59
 Act II
 2024/02/07 05:00
 Act III
 2024/02/09 05:00
 Gameplay Duration
 Paper Shadows A-Foraging
 2024/02/05 11:00
 Joyful Beasts and Their Auspices
 2024/02/05 11:00
 Iridescent Cloud-Striding
 2024/02/07 05:00
 ※ "Hustle and Bustle" Quest Start Time: 2024/02/11 05:00
 ※ During the event, complete Act II to obtain "Special Furnishing Gift (I)," and complete the quest "Hustle and Bustle" to obtain "Special Furnishing Gift (II)."
  
 〓Event Rewards〓

  
 〓Eligibility〓
 Adventure Rank 20 or above
 And complete Archon Quest Prologue: Act III "Song of the Dragon and Freedom"
 ※ Complete Archon Quest Chapter I: Act III "A New Star Approaches" and Xianyun's Story Quest "Grus Serena Chapter: Act I" first to get the best experience from this event.
 ※ Complete Furina's Story Quest "Animula Choragi Chapter: Act I" before accepting the quest "Hustle and Bustle" to best enjoy the event.
  
 〓Event Details〓
 ● During the event, the following gameplay modes will unlock in sequence: "Paper Shadows A-Foraging," "Joyful Beasts and Their Auspices," and "Iridescent Cloud-Striding."
 ● In the "Paper Shadows A-Foraging" gameplay, Travelers can watch unique "Paper Theater" and guide Guoba and Yuegui to find ingredients and cook mouth-wateringly delicious dishes.
 ● In the "Joyful Beasts and Their Auspices" gameplay, Travelers can play "Just Wushou Dance!" with three others, competing to grab various Teabricks, and experience the boisterous Wushou atmosphere.
 ● In the "Iridescent Cloud-Striding" gameplay, Travelers can challenge racing trials, and make skillful use of the "Golden Carp's Leap" to agilely traverse the mountains of Chenyu Vale.
 ● Complete the event's various gameplay modes to gain Festive Fever. Reach a certain amount of Festive Fever to obtain Xingqiu's outfit "Bamboo Rain" and a 4-star character from Liyue of your choice.
 ● Xingqiu's outfit "Bamboo Rain" will be available for purchase in the Character Outfit Shop after the end of Version 4.4, which will be priced at 1,680 Genesis Crystals.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/04/61cb7539585e8020a4393f3009f5352d_4914267459747892296.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/25/278f89d7ba90d3d03032e2c06bb86269_4590750458922007408.png
- Event start: Mon Feb 05 2024 11:00:00 GMT+0900
- Event end: Mon Feb 26 2024 04:59:00 GMT+0900
"Genius Invokation TCG" The Forge Realm's Temper: Clever Stratagems
- Subtitle: Genius Invokation TCG - The Forge Realm's Temper
- ID: 20276
- Description: 〓Event Duration〓  
 Available throughout the entirety of Version 4.4
  
 〓Event Rewards〓                     
  
 〓Eligibility〓
 Adventure Rank 32 or above
 Complete Archon Quest Prologue: Act III "Song of the Dragon and Freedom"
 And complete the World Quest "Battlefield of Dice, Cats, and Cards"
  
 〓Event Details〓
 ● After the event starts, Travelers can go to Prince at The Cat's Tail to select stages to challenge.
 ● This event includes 4 stages and each stage has its distinctive challenge rules.
 ● In each stage, Travelers can configure different parameters, including stage difficulty, the health of opponents, and the number of rounds to complete the challenge within.
 ● After completing the challenge, points will be obtained based on the parameters selected. Achieving the required scores will allow Travelers to claim the corresponding rewards.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/04/77bc8ce33030bc36a950e3ef25faf437_7767405279843025799.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/2aced11db7ef3877d6f0a882c1f5f408_3153530013419955040.png
- Event Duration: Available throughout the entirety of Version 4.4
 
"Triumphant Frenzy" Event: Adapt Swiftly to Dispatch Foes
- Subtitle: Triumphant Frenzy
- ID: 20279
- Description: 〓Event Duration〓
 2024/02/15 11:00 – 2024/02/26 04:59

 〓Event Rewards〓
  
 〓Eligibility〓
 Adventure Rank 20 or above
  
 〓Event Details〓
 ● For 5 days after the start of the event, a new challenge will become available each day.
 ● Each challenge will have four rounds of battle. Before the first round of every challenge, you can select four characters to form a team, and before each following challenge round, you can select two characters to join the team.
 ● Every character starts with 2 Resolve. Each time a character takes part in a combat round, they will lose 1 Resolve. Characters who run out of Resolve cannot continue to be deployed.
 ● Each challenge will have a unique type of "Roiling Resolve": Special effects will be obtained based on the total Resolve of the team members. Pay attention to these effects and use them effectively to obtain their benefits in battle.
 ● The trial characters available in this gameplay mode will inherit the same Constellation levels of the characters owned by the Traveler.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/04/fce1b7f28d88efa7ddcd9e9fa11ff13e_1241963894308448591.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/19/b1a216153427bdfdeda97d1ad431450e_8649130054520114824.png
- Event start: Thu Feb 15 2024 11:00:00 GMT+0900
- Event end: Mon Feb 26 2024 04:59:00 GMT+0900
"Genius Invokation TCG" Heated Battle Mode: Tactical Formation
- Subtitle: Genius Invokation TCG - Heated Battle Mode
- ID: 20280
- Description: 〓Special Rules〓
 ● In this edition of Heated Battle Mode, Travelers must use Character Cards selected on the spot and randomly generated Action Cards to do battle.
  
 〓Event Duration〓
 2024/02/17 11:00 – 2024/03/04 04:59
  
 〓Event Rewards〓           


 〓Eligibility〓
 Adventure Rank 32 or above
 Complete Archon Quest Prologue: Act III "Song of the Dragon and Freedom"
 And complete the World Quest "Battlefield of Dice, Cats, and Cards"
  
 〓Event Details〓
 ● After the event starts, Travelers can go to the Invitation Board of The Cat's Tail to participate in Genius Invokation TCG duels under the special rules of "Heated Battle Mode."
 ● Travelers can invite teammates or participate in duels via match-making after reaching Player Level 4.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/04/77bc8ce33030bc36a950e3ef25faf437_6871759097049230274.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/eb5007969515ec14b14338bf62ff1a37_3781496156810561757.png
- Event start: Sat Feb 17 2024 11:00:00 GMT+0900
- Event end: Mon Mar 04 2024 04:59:00 GMT+0900
"Receiver of Friends From Afar" Event: Cuisine Cooking Challenge
- Subtitle: Receiver of Friends From Afar
- ID: 20287
- Description: 〓Event Duration〓
 2024/02/21 11:00 – 2024/03/04 04:59
  
 〓Event Rewards〓
  
 〓Eligibility〓
 Adventure Rank 28 or above
 And complete Archon Quest Chapter I: Act III "A New Star Approaches"
  
 〓Event Details〓
 ● After the event begins, new quests and challenges will unlock every 2 days. Newly unlocked content will require you to have finished the previous section of content to take it on.
 ● During the challenges, you must perform the prepping, mixing, and cooking processes in succession to create dishes that suit the customer's taste.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/04/e292217d76a24c5975ea29bca43f36fa_3050922049508011904.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/f71bcbebf7f16998027f16c7a19808f3_4022872880254363828.png
- Event start: Wed Feb 21 2024 11:00:00 GMT+0900
- Event end: Mon Mar 04 2024 04:59:00 GMT+0900
"Of Kites and New Sights" - Lantern Rite Gifts
- Subtitle: Of Kites and New Sights
- ID: 20288
- Description: During the event, log in to the game to receive Intertwined Fates, Fragile Resin, Sanctifying Unction, and other rewards!
 Each mail can be collected until the end of the event.
 The mail will expire after 30 days, so don't forget to claim the rewards in time.
  
 〓Event Duration〓
 2024/02/24 01:00 until the end of Version 4.4
  
 〓Eligibility〓
 Adventure Rank 2 or above
  
 〓Event Details〓
 Login Date
 Reward 1
 Reward 2
 Reward 3
 Reward 4
 February 24
 Intertwined Fate ×1
 Bountiful Year ×5
 Universal Peace ×5
 Sanctifying Unction ×6
 February 25
 Fragile Resin ×1
 Chicken Tofu Pudding ×5
 Hero's
 Wit ×5
  
 February 26
 Intertwined Fate ×1
 Guide to Diligence ×3
 Mystic Enhancement Ore ×10
  
 February 27
 Fragile Resin ×1
 Guide to Gold ×3
 Mora ×50,000
  
 February 28
 Intertwined Fate ×1
 Guide to Prosperity ×3
 Sanctifying Unction ×6


- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/ed033703da21fcce4d710321f855b9b1_2776154482425128955.png
- Event Duration: 2024/02/24 01:00 until the end of Version 4.4
 
"Journey Through Hilinigmatic Terrain" Event: Hilichurl Camp Investigation
- Subtitle: Journey Through Hilinigmatic Terrain
- ID: 20289
- Description: 〓Event Duration〓
 2024/02/29 11:00 – 2024/03/11 04:59
  
 〓Event Rewards〓
  
 〓Eligibility〓
 Adventure Rank 20 or above
 And complete Archon Quest Prologue: Act III "Song of the Dragon and Freedom"
  
 〓Event Details〓
 ● This event is divided into two types of gameplay: "Exploratory Journey" and "Hilinigmatic Duel."
 ● After the event begins, new challenges will unlock with time. Complete Exploratory Journeys to unlock the subsequent Hilinigmatic Duels.
 ● In the "Exploratory Journey" gameplay, Travelers must use the Eye of Upano and plan the route wisely to infiltrate the hilichurl camps and conduct secret investigations.
 ● In the "Hilinigmatic Duel" gameplay, Travelers can challenge formidable opponents within the Domain. Take advantage of the opponents' attacks and make use of stage effects to complete the challenge faster.
 ● The "Exploratory Journey" gameplay can only be completed in Single-Player Mode, whereas the "Hilinigmatic Duel" gameplay can be done in Co-Op Mode.
- Reward image URL: https://sdk.hoyoverse.com/upload/ann/2024/01/26/a1ad94a909b35268e42f842dd67315b6_962843665382515102.png
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/5d4c5fb8a2f22a643a134dfbb1a384b5_4060884614593215980.png
- Event start: Thu Feb 29 2024 11:00:00 GMT+0900
- Event end: Mon Mar 11 2024 04:59:00 GMT+0900
"Overflowing Mastery" Event: Double Drops With Talent Level-Up Materials
- Subtitle: Overflowing Mastery
- ID: 3814
- Description: During the event, successfully challenge Talent Level-Up Material Domains and consume "Original Resin" to double your rewards.
  
 〓Event Duration〓
 2024/03/04 05:00 –2024/03/11 04:59
  
 〓Eligibility〓
 After activating corresponding Talent Level-Up Material Domains
  
 〓Event Details〓
 ● During the "Overflowing Mastery" event, successfully challenge Talent Level-Up Material Domains and consume "Original Resin" to double your rewards. You can double your rewards up to 3 times a day!

- Reward image URL: undefined
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2023/09/27/d57d50a9b8fd0e6fc427f0f0b9e0f426_6857870438560182482.jpg
- Event start: Mon Mar 04 2024 05:00:00 GMT+0900
- Event end: Mon Mar 11 2024 04:59:00 GMT+0900

*/
