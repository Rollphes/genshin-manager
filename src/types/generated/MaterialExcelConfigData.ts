// To parse this data:
//
//   import { Convert } from "./file";
//
//   const materialExcelConfigDataType = Convert.toMaterialExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type MaterialExcelConfigDataType = {
    closeBagAfterUsed:           boolean;
    cdGroup:                     number;
    cdTime:                      number;
    dropable:                    boolean;
    descTextMapHash:             number;
    destroyReturnMaterial:       any[];
    destroyReturnMaterialCount:  any[];
    destroyRule:                 DestroyRule;
    IOMEHCHLAJM:                 boolean;
    GOFEFCODPII:                 Gofefcodpii;
    isForceGetHint:              boolean;
    effectDescTextMapHash:       number;
    effectGadgetID:              number;
    effectIcon:                  EffectIcon;
    effectName:                  EffectName;
    foodQuality:                 FoodQuality;
    gadgetId:                    number;
    globalItemLimit:             number;
    icon:                        string;
    id:                          number;
    interactionTitleTextMapHash: number;
    isHidden:                    boolean;
    isSplitDrop:                 boolean;
    noFirstGetHint:              boolean;
    itemType:                    ItemType;
    itemUse:                     ItemUse[];
    PCOPCNFOONA:                 Pcopcnfoona;
    materialType:                MaterialType;
    maxUseCount:                 number;
    nameTextMapHash:             number;
    PHKICCAOKCK:                 boolean;
    HJCEKDFGLCG:                 Hjcekdfglcg;
    picPath:                     string[];
    playGainEffect:              boolean;
    rank:                        number;
    rankLevel:                   number;
    satiationParams:             number[];
    setID:                       number;
    specialDescTextMapHash:      number;
    stackLimit:                  number;
    typeDescTextMapHash:         number;
    useLevel:                    number;
    useOnGain:                   boolean;
    useTarget:                   UseTarget;
    weight:                      number;
}

export enum Gofefcodpii {
    MaterialSysTypeBeyond = "MATERIAL_SYS_TYPE_BEYOND",
    MaterialSysTypeNone = "MATERIAL_SYS_TYPE_NONE",
}

export enum Hjcekdfglcg {
    FilterADVENTURE = "Filter_ADVENTURE",
    FilterATTACK = "Filter_ATTACK",
    FilterDEFENSE = "Filter_DEFENSE",
    FilterHEAL = "Filter_HEAL",
    FilterMEDICAL = "Filter_MEDICAL",
    FilterOTHER = "Filter_OTHER",
}

export enum Pcopcnfoona {
    AtkUp = "ATK_UP",
    BlackEgg = "BLACK_EGG",
    ColdResist = "Cold_Resist",
    CritUp = "CRIT_UP",
    DefUp = "DEF_UP",
    EFFIktomisaurus = "Eff_Iktomisaurus",
    EFFKoholasaurus = "Eff_Koholasaurus",
    EFFQucusaurus = "Eff_Qucusaurus",
    EFFTatankasaurus = "Eff_Tatankasaurus",
    EFFTepetlisaurus = "Eff_Tepetlisaurus",
    EFFYumkasaurus = "Eff_Yumkasaurus",
    HappyWater = "Happy_Water",
    HealOvertime = "Heal_Overtime",
    HealingUP = "Healing_UP",
    HolyWater = "Holy_Water",
    MaxHPUp = "MAX_HP_UP",
    None = "None",
    PhysicalDMGUP = "Physical_DMG_UP",
    RandomReconvery = "Random_Reconvery",
    Recovery = "Recovery",
    RecoveryByChest = "Recovery_By_Chest",
    Revive = "Revive",
    STAClimbReduce = "STA_Climb_Reduce",
    STAFlyReduce = "STA_Fly_Reduce",
    STARecovery = "STA_Recovery",
    STARecoveryByKill = "STA_Recovery_By_Kill",
    STASprintReduce = "STA_Sprint_Reduce",
    ShieldStrength = "Shield_Strength",
}

export enum DestroyRule {
    DestroyNone = "DESTROY_NONE",
    DestroyReturnMaterial = "DESTROY_RETURN_MATERIAL",
}

export enum EffectIcon {
    Empty = "",
    UIBuffFireworks = "UI_Buff_Fireworks",
    UIBuffItemAdventure = "UI_Buff_Item_Adventure",
    UIBuffItemAtkAdd = "UI_Buff_Item_Atk_Add",
    UIBuffItemAtkCritRate = "UI_Buff_Item_Atk_CritRate",
    UIBuffItemAtkElementHurtElect = "UI_Buff_Item_Atk_ElementHurt_Elect",
    UIBuffItemAtkElementHurtFire = "UI_Buff_Item_Atk_ElementHurt_Fire",
    UIBuffItemAtkElementHurtGrass = "UI_Buff_Item_Atk_ElementHurt_Grass",
    UIBuffItemAtkElementHurtIce = "UI_Buff_Item_Atk_ElementHurt_Ice",
    UIBuffItemAtkElementHurtRock = "UI_Buff_Item_Atk_ElementHurt_Rock",
    UIBuffItemAtkElementHurtWater = "UI_Buff_Item_Atk_ElementHurt_Water",
    UIBuffItemAtkElementHurtWind = "UI_Buff_Item_Atk_ElementHurt_Wind",
    UIBuffItemClimateHeat = "UI_Buff_Item_Climate_Heat",
    UIBuffItemDefAdd = "UI_Buff_Item_Def_Add",
    UIBuffItemDefResistanceElect = "UI_Buff_Item_Def_Resistance_Elect",
    UIBuffItemDefResistanceFire = "UI_Buff_Item_Def_Resistance_Fire",
    UIBuffItemDefResistanceGrass = "UI_Buff_Item_Def_Resistance_Grass",
    UIBuffItemDefResistanceIce = "UI_Buff_Item_Def_Resistance_Ice",
    UIBuffItemDefResistanceRock = "UI_Buff_Item_Def_Resistance_Rock",
    UIBuffItemDefResistanceWater = "UI_Buff_Item_Def_Resistance_Water",
    UIBuffItemDefResistanceWind = "UI_Buff_Item_Def_Resistance_Wind",
    UIBuffItemOtherSPAdd = "UI_Buff_Item_Other_SPAdd",
    UIBuffItemOtherSPReduceConsume = "UI_Buff_Item_Other_SPReduceConsume",
    UIBuffItemRecoveryHPAdd = "UI_Buff_Item_Recovery_HpAdd",
    UIBuffItemRecoveryHPAddAll = "UI_Buff_Item_Recovery_HpAddAll",
    UIBuffItemRecoveryRevive = "UI_Buff_Item_Recovery_Revive",
    UIBuffItemSpecialEffect = "UI_Buff_Item_SpecialEffect",
}

export enum EffectName {
    EFFRockCrystalAbsorb = "Eff_RockCrystal_Absorb",
    EFFSceneObjCelestiaSplinterAbsorb = "Eff_SceneObj_CelestiaSplinter_Absorb",
    EFFSceneObjDendroCrystalAbsorb = "Eff_SceneObj_DendroCrystal_Absorb",
    EFFSceneObjElectricCrystalAbsorb = "Eff_SceneObj_ElectricCrystal_Absorb",
    EFFSceneObjEssenceTreasure01_Absorb = "Eff_SceneObj_EssenceTreasure_01_Absorb",
    EFFSceneObjFontaineCrystalAbsorb = "Eff_SceneObj_FontaineCrystal_Absorb",
    EFFSceneObjLuminousEnergy01_Absorb = "Eff_SceneObj_LuminousEnergy_01_Absorb",
    EFFSceneObjMagicBookPageAbsorb = "Eff_SceneObj_MagicBookPage_Absorb",
    EFFSceneObjMoonlitSigil01_Absorb = "Eff_SceneObj_MoonlitSigil_01_Absorb",
    EFFSceneObjNataCrystalAbsorb = "Eff_SceneObj_NataCrystal_Absorb",
    EFFSceneObjNodKraiCrystalAbsorb = "Eff_SceneObj_NodKraiCrystal_Absorb",
    EFFSceneObjPenumbraTicketCollect01 = "Eff_SceneObj_PenumbraTicket_Collect_01",
    EFFWindCrystalAbsorb = "Eff_WindCrystal_Absorb",
    Empty = "",
}

export enum FoodQuality {
    FoodQualityDelicious = "FOOD_QUALITY_DELICIOUS",
    FoodQualityNone = "FOOD_QUALITY_NONE",
    FoodQualityOrdinary = "FOOD_QUALITY_ORDINARY",
    FoodQualityStrange = "FOOD_QUALITY_STRANGE",
}

export enum ItemType {
    ItemMaterial = "ITEM_MATERIAL",
    ItemVirtual = "ITEM_VIRTUAL",
}

export type ItemUse = {
    useOp:    UseOp;
    useParam: string[];
}

export enum UseOp {
    ItemUseAcceptQuest = "ITEM_USE_ACCEPT_QUEST",
    ItemUseAddAlchemySimItem = "ITEM_USE_ADD_ALCHEMY_SIM_ITEM",
    ItemUseAddAllEnergy = "ITEM_USE_ADD_ALL_ENERGY",
    ItemUseAddAvatarExtraProperty = "ITEM_USE_ADD_AVATAR_EXTRA_PROPERTY",
    ItemUseAddChannellerSlabBuff = "ITEM_USE_ADD_CHANNELLER_SLAB_BUFF",
    ItemUseAddCurHP = "ITEM_USE_ADD_CUR_HP",
    ItemUseAddCurStamina = "ITEM_USE_ADD_CUR_STAMINA",
    ItemUseAddDungeonCondTime = "ITEM_USE_ADD_DUNGEON_COND_TIME",
    ItemUseAddElemEnergy = "ITEM_USE_ADD_ELEM_ENERGY",
    ItemUseAddExp = "ITEM_USE_ADD_EXP",
    ItemUseAddItem = "ITEM_USE_ADD_ITEM",
    ItemUseAddMagnetPower = "ITEM_USE_ADD_MAGNET_POWER",
    ItemUseAddPersistStamina = "ITEM_USE_ADD_PERSIST_STAMINA",
    ItemUseAddPhlogiston = "ITEM_USE_ADD_PHLOGISTON",
    ItemUseAddRegionalPlayVar = "ITEM_USE_ADD_REGIONAL_PLAY_VAR",
    ItemUseAddReliquaryExp = "ITEM_USE_ADD_RELIQUARY_EXP",
    ItemUseAddSelectItem = "ITEM_USE_ADD_SELECT_ITEM",
    ItemUseAddServerBuff = "ITEM_USE_ADD_SERVER_BUFF",
    ItemUseAddTemporaryStamina = "ITEM_USE_ADD_TEMPORARY_STAMINA",
    ItemUseAddWeaponExp = "ITEM_USE_ADD_WEAPON_EXP",
    ItemUseAddWeaponSkin = "ITEM_USE_ADD_WEAPON_SKIN",
    ItemUseCheckFormalAvatar = "ITEM_USE_CHECK_FORMAL_AVATAR",
    ItemUseChestSelectItem = "ITEM_USE_CHEST_SELECT_ITEM",
    ItemUseCombineItem = "ITEM_USE_COMBINE_ITEM",
    ItemUseGainAvatar = "ITEM_USE_GAIN_AVATAR",
    ItemUseGainAvatarTalentMaterial = "ITEM_USE_GAIN_AVATAR_TALENT_MATERIAL",
    ItemUseGainCardProduct = "ITEM_USE_GAIN_CARD_PRODUCT",
    ItemUseGainCostume = "ITEM_USE_GAIN_COSTUME",
    ItemUseGainFlycloak = "ITEM_USE_GAIN_FLYCLOAK",
    ItemUseGainGcgCard = "ITEM_USE_GAIN_GCG_CARD",
    ItemUseGainGcgCardBack = "ITEM_USE_GAIN_GCG_CARD_BACK",
    ItemUseGainGcgCardFace = "ITEM_USE_GAIN_GCG_CARD_FACE",
    ItemUseGainGcgCardField = "ITEM_USE_GAIN_GCG_CARD_FIELD",
    ItemUseGainNameCard = "ITEM_USE_GAIN_NAME_CARD",
    ItemUseGrantSelectReward = "ITEM_USE_GRANT_SELECT_REWARD",
    ItemUseMakeGadget = "ITEM_USE_MAKE_GADGET",
    ItemUseMusicGameBookUnlockTheme = "ITEM_USE_MUSIC_GAME_BOOK_UNLOCK_THEME",
    ItemUseNone = "ITEM_USE_NONE",
    ItemUseOpenDropExtra = "ITEM_USE_OPEN_DROP_EXTRA",
    ItemUseOpenRandomChest = "ITEM_USE_OPEN_RANDOM_CHEST",
    ItemUseOpenRenameDialog = "ITEM_USE_OPEN_RENAME_DIALOG",
    ItemUseReliveAvatar = "ITEM_USE_RELIVE_AVATAR",
    ItemUseSetOpenState = "ITEM_USE_SET_OPEN_STATE",
    ItemUseUnlockAvatarTrace = "ITEM_USE_UNLOCK_AVATAR_TRACE",
    ItemUseUnlockCodex = "ITEM_USE_UNLOCK_CODEX",
    ItemUseUnlockCombine = "ITEM_USE_UNLOCK_COMBINE",
    ItemUseUnlockCookRecipe = "ITEM_USE_UNLOCK_COOK_RECIPE",
    ItemUseUnlockForge = "ITEM_USE_UNLOCK_FORGE",
    ItemUseUnlockFurnitureFormula = "ITEM_USE_UNLOCK_FURNITURE_FORMULA",
    ItemUseUnlockFurnitureSuite = "ITEM_USE_UNLOCK_FURNITURE_SUITE",
    ItemUseUnlockHomeBgm = "ITEM_USE_UNLOCK_HOME_BGM",
    ItemUseUnlockHomeModule = "ITEM_USE_UNLOCK_HOME_MODULE",
    ItemUseUnlockNormalBeyondBattlePass = "ITEM_USE_UNLOCK_NORMAL_BEYOND_BATTLE_PASS",
    ItemUseUnlockPaidBattlePassNormal = "ITEM_USE_UNLOCK_PAID_BATTLE_PASS_NORMAL",
    ItemUseUnlockPhotographPose = "ITEM_USE_UNLOCK_PHOTOGRAPH_POSE",
    ItemUseUnlockProfileFrame = "ITEM_USE_UNLOCK_PROFILE_FRAME",
    ItemUseUnlockProfilePicture = "ITEM_USE_UNLOCK_PROFILE_PICTURE",
}

export enum MaterialType {
    MaterialActivityGear = "MATERIAL_ACTIVITY_GEAR",
    MaterialActivityJigsaw = "MATERIAL_ACTIVITY_JIGSAW",
    MaterialActivityRobot = "MATERIAL_ACTIVITY_ROBOT",
    MaterialAdsorbate = "MATERIAL_ADSORBATE",
    MaterialAranara = "MATERIAL_ARANARA",
    MaterialAvatar = "MATERIAL_AVATAR",
    MaterialAvatarMaterial = "MATERIAL_AVATAR_MATERIAL",
    MaterialAvatarTalentMaterial = "MATERIAL_AVATAR_TALENT_MATERIAL",
    MaterialAvatarTrace = "MATERIAL_AVATAR_TRACE",
    MaterialBgm = "MATERIAL_BGM",
    MaterialChannellerSlabBuff = "MATERIAL_CHANNELLER_SLAB_BUFF",
    MaterialChest = "MATERIAL_CHEST",
    MaterialChestBatchUse = "MATERIAL_CHEST_BATCH_USE",
    MaterialChestBatchUseWithGroup = "MATERIAL_CHEST_BATCH_USE_WITH_GROUP",
    MaterialClueShopHandbook = "MATERIAL_CLUE_SHOP_HANDBOOK",
    MaterialConsume = "MATERIAL_CONSUME",
    MaterialConsumeBatchUse = "MATERIAL_CONSUME_BATCH_USE",
    MaterialCostume = "MATERIAL_COSTUME",
    MaterialCricket = "MATERIAL_CRICKET",
    MaterialDeshretManual = "MATERIAL_DESHRET_MANUAL",
    MaterialElemCrystal = "MATERIAL_ELEM_CRYSTAL",
    MaterialExchange = "MATERIAL_EXCHANGE",
    MaterialExpFruit = "MATERIAL_EXP_FRUIT",
    MaterialFakeAbsorbate = "MATERIAL_FAKE_ABSORBATE",
    MaterialFireMasterAvatarTalentItem = "MATERIAL_FIRE_MASTER_AVATAR_TALENT_ITEM",
    MaterialFireworks = "MATERIAL_FIREWORKS",
    MaterialFishBait = "MATERIAL_FISH_BAIT",
    MaterialFishRod = "MATERIAL_FISH_ROD",
    MaterialFlycloak = "MATERIAL_FLYCLOAK",
    MaterialFood = "MATERIAL_FOOD",
    MaterialFurnitureFormula = "MATERIAL_FURNITURE_FORMULA",
    MaterialFurnitureSuiteFormula = "MATERIAL_FURNITURE_SUITE_FORMULA",
    MaterialGcgCard = "MATERIAL_GCG_CARD",
    MaterialGcgCardBack = "MATERIAL_GCG_CARD_BACK",
    MaterialGcgCardFace = "MATERIAL_GCG_CARD_FACE",
    MaterialGcgExchangeItem = "MATERIAL_GCG_EXCHANGE_ITEM",
    MaterialGcgField = "MATERIAL_GCG_FIELD",
    MaterialGreatefestivalv2Invite = "MATERIAL_GREATEFESTIVALV2_INVITE",
    MaterialHolidayMemoryBook = "MATERIAL_HOLIDAY_MEMORY_BOOK",
    MaterialHolidayResortInvite = "MATERIAL_HOLIDAY_RESORT_INVITE",
    MaterialHomeSeed = "MATERIAL_HOME_SEED",
    MaterialLanv5PaimonGreetingCard = "MATERIAL_LANV5_PAIMON_GREETING_CARD",
    MaterialMagicStoryBook = "MATERIAL_MAGIC_STORY_BOOK",
    MaterialMikawaFlowerInvite = "MATERIAL_MIKAWA_FLOWER_INVITE",
    MaterialMoonNightCard = "MATERIAL_MOON_NIGHT_CARD",
    MaterialMusicGameBookTheme = "MATERIAL_MUSIC_GAME_BOOK_THEME",
    MaterialNamecard = "MATERIAL_NAMECARD",
    MaterialNatlanRaceAlbum = "MATERIAL_NATLAN_RACE_ALBUM",
    MaterialNatlanRaceEnvelope = "MATERIAL_NATLAN_RACE_ENVELOPE",
    MaterialNatlanRelationA = "MATERIAL_NATLAN_RELATION_A",
    MaterialNatlanRelationB = "MATERIAL_NATLAN_RELATION_B",
    MaterialNone = "MATERIAL_NONE",
    MaterialNoticeAddHP = "MATERIAL_NOTICE_ADD_HP",
    MaterialPhotoDisplayBook = "MATERIAL_PHOTO_DISPLAY_BOOK",
    MaterialPhotographPose = "MATERIAL_PHOTOGRAPH_POSE",
    MaterialPhotov5HandBook = "MATERIAL_PHOTOV5_HAND_BOOK",
    MaterialPhotov6HandBook = "MATERIAL_PHOTOV6_HAND_BOOK",
    MaterialProfileFrame = "MATERIAL_PROFILE_FRAME",
    MaterialProfilePicture = "MATERIAL_PROFILE_PICTURE",
    MaterialQuest = "MATERIAL_QUEST",
    MaterialQuestAlbum = "MATERIAL_QUEST_ALBUM",
    MaterialQuestEventBook = "MATERIAL_QUEST_EVENT_BOOK",
    MaterialRainbowPrinceHandBook = "MATERIAL_RAINBOW_PRINCE_HAND_BOOK",
    MaterialRareGrowthMaterial = "MATERIAL_RARE_GROWTH_MATERIAL",
    MaterialReliquaryMaterial = "MATERIAL_RELIQUARY_MATERIAL",
    MaterialRemusMusicBox = "MATERIAL_REMUS_MUSIC_BOX",
    MaterialRenameItem = "MATERIAL_RENAME_ITEM",
    MaterialRoboGift = "MATERIAL_ROBO_GIFT",
    MaterialSeaLamp = "MATERIAL_SEA_LAMP",
    MaterialSelectableChest = "MATERIAL_SELECTABLE_CHEST",
    MaterialSpiceFood = "MATERIAL_SPICE_FOOD",
    MaterialTalent = "MATERIAL_TALENT",
    MaterialWeaponExpStone = "MATERIAL_WEAPON_EXP_STONE",
    MaterialWeaponSkin = "MATERIAL_WEAPON_SKIN",
    MaterialWidget = "MATERIAL_WIDGET",
    MaterialWood = "MATERIAL_WOOD",
}

export enum UseTarget {
    ItemUseTargetCurTeam = "ITEM_USE_TARGET_CUR_TEAM",
    ItemUseTargetNone = "ITEM_USE_TARGET_NONE",
    ItemUseTargetPlayerAvatar = "ITEM_USE_TARGET_PLAYER_AVATAR",
    ItemUseTargetSpecifyAliveAvatar = "ITEM_USE_TARGET_SPECIFY_ALIVE_AVATAR",
    ItemUseTargetSpecifyAvatar = "ITEM_USE_TARGET_SPECIFY_AVATAR",
    ItemUseTargetSpecifyDeadAvatar = "ITEM_USE_TARGET_SPECIFY_DEAD_AVATAR",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMaterialExcelConfigDataType(json: string): MaterialExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("MaterialExcelConfigDataType")));
    }

    public static materialExcelConfigDataTypeToJson(value: MaterialExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("MaterialExcelConfigDataType"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "MaterialExcelConfigDataType": o([
        { json: "closeBagAfterUsed", js: "closeBagAfterUsed", typ: true },
        { json: "cdGroup", js: "cdGroup", typ: 0 },
        { json: "cdTime", js: "cdTime", typ: 0 },
        { json: "dropable", js: "dropable", typ: true },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "destroyReturnMaterial", js: "destroyReturnMaterial", typ: a("any") },
        { json: "destroyReturnMaterialCount", js: "destroyReturnMaterialCount", typ: a("any") },
        { json: "destroyRule", js: "destroyRule", typ: r("DestroyRule") },
        { json: "IOMEHCHLAJM", js: "IOMEHCHLAJM", typ: true },
        { json: "GOFEFCODPII", js: "GOFEFCODPII", typ: r("Gofefcodpii") },
        { json: "isForceGetHint", js: "isForceGetHint", typ: true },
        { json: "effectDescTextMapHash", js: "effectDescTextMapHash", typ: 0 },
        { json: "effectGadgetID", js: "effectGadgetID", typ: 0 },
        { json: "effectIcon", js: "effectIcon", typ: r("EffectIcon") },
        { json: "effectName", js: "effectName", typ: r("EffectName") },
        { json: "foodQuality", js: "foodQuality", typ: r("FoodQuality") },
        { json: "gadgetId", js: "gadgetId", typ: 0 },
        { json: "globalItemLimit", js: "globalItemLimit", typ: 0 },
        { json: "icon", js: "icon", typ: "" },
        { json: "id", js: "id", typ: 0 },
        { json: "interactionTitleTextMapHash", js: "interactionTitleTextMapHash", typ: 0 },
        { json: "isHidden", js: "isHidden", typ: true },
        { json: "isSplitDrop", js: "isSplitDrop", typ: true },
        { json: "noFirstGetHint", js: "noFirstGetHint", typ: true },
        { json: "itemType", js: "itemType", typ: r("ItemType") },
        { json: "itemUse", js: "itemUse", typ: a(r("ItemUse")) },
        { json: "PCOPCNFOONA", js: "PCOPCNFOONA", typ: r("Pcopcnfoona") },
        { json: "materialType", js: "materialType", typ: r("MaterialType") },
        { json: "maxUseCount", js: "maxUseCount", typ: 0 },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "PHKICCAOKCK", js: "PHKICCAOKCK", typ: true },
        { json: "HJCEKDFGLCG", js: "HJCEKDFGLCG", typ: r("Hjcekdfglcg") },
        { json: "picPath", js: "picPath", typ: a("") },
        { json: "playGainEffect", js: "playGainEffect", typ: true },
        { json: "rank", js: "rank", typ: 0 },
        { json: "rankLevel", js: "rankLevel", typ: 0 },
        { json: "satiationParams", js: "satiationParams", typ: a(0) },
        { json: "setID", js: "setID", typ: 0 },
        { json: "specialDescTextMapHash", js: "specialDescTextMapHash", typ: 0 },
        { json: "stackLimit", js: "stackLimit", typ: 0 },
        { json: "typeDescTextMapHash", js: "typeDescTextMapHash", typ: 0 },
        { json: "useLevel", js: "useLevel", typ: 0 },
        { json: "useOnGain", js: "useOnGain", typ: true },
        { json: "useTarget", js: "useTarget", typ: r("UseTarget") },
        { json: "weight", js: "weight", typ: 0 },
    ], false),
    "ItemUse": o([
        { json: "useOp", js: "useOp", typ: r("UseOp") },
        { json: "useParam", js: "useParam", typ: a("") },
    ], false),
    "Gofefcodpii": [
        "MATERIAL_SYS_TYPE_BEYOND",
        "MATERIAL_SYS_TYPE_NONE",
    ],
    "Hjcekdfglcg": [
        "Filter_ADVENTURE",
        "Filter_ATTACK",
        "Filter_DEFENSE",
        "Filter_HEAL",
        "Filter_MEDICAL",
        "Filter_OTHER",
    ],
    "Pcopcnfoona": [
        "ATK_UP",
        "BLACK_EGG",
        "Cold_Resist",
        "CRIT_UP",
        "DEF_UP",
        "Eff_Iktomisaurus",
        "Eff_Koholasaurus",
        "Eff_Qucusaurus",
        "Eff_Tatankasaurus",
        "Eff_Tepetlisaurus",
        "Eff_Yumkasaurus",
        "Happy_Water",
        "Heal_Overtime",
        "Healing_UP",
        "Holy_Water",
        "MAX_HP_UP",
        "None",
        "Physical_DMG_UP",
        "Random_Reconvery",
        "Recovery",
        "Recovery_By_Chest",
        "Revive",
        "STA_Climb_Reduce",
        "STA_Fly_Reduce",
        "STA_Recovery",
        "STA_Recovery_By_Kill",
        "STA_Sprint_Reduce",
        "Shield_Strength",
    ],
    "DestroyRule": [
        "DESTROY_NONE",
        "DESTROY_RETURN_MATERIAL",
    ],
    "EffectIcon": [
        "",
        "UI_Buff_Fireworks",
        "UI_Buff_Item_Adventure",
        "UI_Buff_Item_Atk_Add",
        "UI_Buff_Item_Atk_CritRate",
        "UI_Buff_Item_Atk_ElementHurt_Elect",
        "UI_Buff_Item_Atk_ElementHurt_Fire",
        "UI_Buff_Item_Atk_ElementHurt_Grass",
        "UI_Buff_Item_Atk_ElementHurt_Ice",
        "UI_Buff_Item_Atk_ElementHurt_Rock",
        "UI_Buff_Item_Atk_ElementHurt_Water",
        "UI_Buff_Item_Atk_ElementHurt_Wind",
        "UI_Buff_Item_Climate_Heat",
        "UI_Buff_Item_Def_Add",
        "UI_Buff_Item_Def_Resistance_Elect",
        "UI_Buff_Item_Def_Resistance_Fire",
        "UI_Buff_Item_Def_Resistance_Grass",
        "UI_Buff_Item_Def_Resistance_Ice",
        "UI_Buff_Item_Def_Resistance_Rock",
        "UI_Buff_Item_Def_Resistance_Water",
        "UI_Buff_Item_Def_Resistance_Wind",
        "UI_Buff_Item_Other_SPAdd",
        "UI_Buff_Item_Other_SPReduceConsume",
        "UI_Buff_Item_Recovery_HpAdd",
        "UI_Buff_Item_Recovery_HpAddAll",
        "UI_Buff_Item_Recovery_Revive",
        "UI_Buff_Item_SpecialEffect",
    ],
    "EffectName": [
        "Eff_RockCrystal_Absorb",
        "Eff_SceneObj_CelestiaSplinter_Absorb",
        "Eff_SceneObj_DendroCrystal_Absorb",
        "Eff_SceneObj_ElectricCrystal_Absorb",
        "Eff_SceneObj_EssenceTreasure_01_Absorb",
        "Eff_SceneObj_FontaineCrystal_Absorb",
        "Eff_SceneObj_LuminousEnergy_01_Absorb",
        "Eff_SceneObj_MagicBookPage_Absorb",
        "Eff_SceneObj_MoonlitSigil_01_Absorb",
        "Eff_SceneObj_NataCrystal_Absorb",
        "Eff_SceneObj_NodKraiCrystal_Absorb",
        "Eff_SceneObj_PenumbraTicket_Collect_01",
        "Eff_WindCrystal_Absorb",
        "",
    ],
    "FoodQuality": [
        "FOOD_QUALITY_DELICIOUS",
        "FOOD_QUALITY_NONE",
        "FOOD_QUALITY_ORDINARY",
        "FOOD_QUALITY_STRANGE",
    ],
    "ItemType": [
        "ITEM_MATERIAL",
        "ITEM_VIRTUAL",
    ],
    "UseOp": [
        "ITEM_USE_ACCEPT_QUEST",
        "ITEM_USE_ADD_ALCHEMY_SIM_ITEM",
        "ITEM_USE_ADD_ALL_ENERGY",
        "ITEM_USE_ADD_AVATAR_EXTRA_PROPERTY",
        "ITEM_USE_ADD_CHANNELLER_SLAB_BUFF",
        "ITEM_USE_ADD_CUR_HP",
        "ITEM_USE_ADD_CUR_STAMINA",
        "ITEM_USE_ADD_DUNGEON_COND_TIME",
        "ITEM_USE_ADD_ELEM_ENERGY",
        "ITEM_USE_ADD_EXP",
        "ITEM_USE_ADD_ITEM",
        "ITEM_USE_ADD_MAGNET_POWER",
        "ITEM_USE_ADD_PERSIST_STAMINA",
        "ITEM_USE_ADD_PHLOGISTON",
        "ITEM_USE_ADD_REGIONAL_PLAY_VAR",
        "ITEM_USE_ADD_RELIQUARY_EXP",
        "ITEM_USE_ADD_SELECT_ITEM",
        "ITEM_USE_ADD_SERVER_BUFF",
        "ITEM_USE_ADD_TEMPORARY_STAMINA",
        "ITEM_USE_ADD_WEAPON_EXP",
        "ITEM_USE_ADD_WEAPON_SKIN",
        "ITEM_USE_CHECK_FORMAL_AVATAR",
        "ITEM_USE_CHEST_SELECT_ITEM",
        "ITEM_USE_COMBINE_ITEM",
        "ITEM_USE_GAIN_AVATAR",
        "ITEM_USE_GAIN_AVATAR_TALENT_MATERIAL",
        "ITEM_USE_GAIN_CARD_PRODUCT",
        "ITEM_USE_GAIN_COSTUME",
        "ITEM_USE_GAIN_FLYCLOAK",
        "ITEM_USE_GAIN_GCG_CARD",
        "ITEM_USE_GAIN_GCG_CARD_BACK",
        "ITEM_USE_GAIN_GCG_CARD_FACE",
        "ITEM_USE_GAIN_GCG_CARD_FIELD",
        "ITEM_USE_GAIN_NAME_CARD",
        "ITEM_USE_GRANT_SELECT_REWARD",
        "ITEM_USE_MAKE_GADGET",
        "ITEM_USE_MUSIC_GAME_BOOK_UNLOCK_THEME",
        "ITEM_USE_NONE",
        "ITEM_USE_OPEN_DROP_EXTRA",
        "ITEM_USE_OPEN_RANDOM_CHEST",
        "ITEM_USE_OPEN_RENAME_DIALOG",
        "ITEM_USE_RELIVE_AVATAR",
        "ITEM_USE_SET_OPEN_STATE",
        "ITEM_USE_UNLOCK_AVATAR_TRACE",
        "ITEM_USE_UNLOCK_CODEX",
        "ITEM_USE_UNLOCK_COMBINE",
        "ITEM_USE_UNLOCK_COOK_RECIPE",
        "ITEM_USE_UNLOCK_FORGE",
        "ITEM_USE_UNLOCK_FURNITURE_FORMULA",
        "ITEM_USE_UNLOCK_FURNITURE_SUITE",
        "ITEM_USE_UNLOCK_HOME_BGM",
        "ITEM_USE_UNLOCK_HOME_MODULE",
        "ITEM_USE_UNLOCK_NORMAL_BEYOND_BATTLE_PASS",
        "ITEM_USE_UNLOCK_PAID_BATTLE_PASS_NORMAL",
        "ITEM_USE_UNLOCK_PHOTOGRAPH_POSE",
        "ITEM_USE_UNLOCK_PROFILE_FRAME",
        "ITEM_USE_UNLOCK_PROFILE_PICTURE",
    ],
    "MaterialType": [
        "MATERIAL_ACTIVITY_GEAR",
        "MATERIAL_ACTIVITY_JIGSAW",
        "MATERIAL_ACTIVITY_ROBOT",
        "MATERIAL_ADSORBATE",
        "MATERIAL_ARANARA",
        "MATERIAL_AVATAR",
        "MATERIAL_AVATAR_MATERIAL",
        "MATERIAL_AVATAR_TALENT_MATERIAL",
        "MATERIAL_AVATAR_TRACE",
        "MATERIAL_BGM",
        "MATERIAL_CHANNELLER_SLAB_BUFF",
        "MATERIAL_CHEST",
        "MATERIAL_CHEST_BATCH_USE",
        "MATERIAL_CHEST_BATCH_USE_WITH_GROUP",
        "MATERIAL_CLUE_SHOP_HANDBOOK",
        "MATERIAL_CONSUME",
        "MATERIAL_CONSUME_BATCH_USE",
        "MATERIAL_COSTUME",
        "MATERIAL_CRICKET",
        "MATERIAL_DESHRET_MANUAL",
        "MATERIAL_ELEM_CRYSTAL",
        "MATERIAL_EXCHANGE",
        "MATERIAL_EXP_FRUIT",
        "MATERIAL_FAKE_ABSORBATE",
        "MATERIAL_FIRE_MASTER_AVATAR_TALENT_ITEM",
        "MATERIAL_FIREWORKS",
        "MATERIAL_FISH_BAIT",
        "MATERIAL_FISH_ROD",
        "MATERIAL_FLYCLOAK",
        "MATERIAL_FOOD",
        "MATERIAL_FURNITURE_FORMULA",
        "MATERIAL_FURNITURE_SUITE_FORMULA",
        "MATERIAL_GCG_CARD",
        "MATERIAL_GCG_CARD_BACK",
        "MATERIAL_GCG_CARD_FACE",
        "MATERIAL_GCG_EXCHANGE_ITEM",
        "MATERIAL_GCG_FIELD",
        "MATERIAL_GREATEFESTIVALV2_INVITE",
        "MATERIAL_HOLIDAY_MEMORY_BOOK",
        "MATERIAL_HOLIDAY_RESORT_INVITE",
        "MATERIAL_HOME_SEED",
        "MATERIAL_LANV5_PAIMON_GREETING_CARD",
        "MATERIAL_MAGIC_STORY_BOOK",
        "MATERIAL_MIKAWA_FLOWER_INVITE",
        "MATERIAL_MOON_NIGHT_CARD",
        "MATERIAL_MUSIC_GAME_BOOK_THEME",
        "MATERIAL_NAMECARD",
        "MATERIAL_NATLAN_RACE_ALBUM",
        "MATERIAL_NATLAN_RACE_ENVELOPE",
        "MATERIAL_NATLAN_RELATION_A",
        "MATERIAL_NATLAN_RELATION_B",
        "MATERIAL_NONE",
        "MATERIAL_NOTICE_ADD_HP",
        "MATERIAL_PHOTO_DISPLAY_BOOK",
        "MATERIAL_PHOTOGRAPH_POSE",
        "MATERIAL_PHOTOV5_HAND_BOOK",
        "MATERIAL_PHOTOV6_HAND_BOOK",
        "MATERIAL_PROFILE_FRAME",
        "MATERIAL_PROFILE_PICTURE",
        "MATERIAL_QUEST",
        "MATERIAL_QUEST_ALBUM",
        "MATERIAL_QUEST_EVENT_BOOK",
        "MATERIAL_RAINBOW_PRINCE_HAND_BOOK",
        "MATERIAL_RARE_GROWTH_MATERIAL",
        "MATERIAL_RELIQUARY_MATERIAL",
        "MATERIAL_REMUS_MUSIC_BOX",
        "MATERIAL_RENAME_ITEM",
        "MATERIAL_ROBO_GIFT",
        "MATERIAL_SEA_LAMP",
        "MATERIAL_SELECTABLE_CHEST",
        "MATERIAL_SPICE_FOOD",
        "MATERIAL_TALENT",
        "MATERIAL_WEAPON_EXP_STONE",
        "MATERIAL_WEAPON_SKIN",
        "MATERIAL_WIDGET",
        "MATERIAL_WOOD",
    ],
    "UseTarget": [
        "ITEM_USE_TARGET_CUR_TEAM",
        "ITEM_USE_TARGET_NONE",
        "ITEM_USE_TARGET_PLAYER_AVATAR",
        "ITEM_USE_TARGET_SPECIFY_ALIVE_AVATAR",
        "ITEM_USE_TARGET_SPECIFY_AVATAR",
        "ITEM_USE_TARGET_SPECIFY_DEAD_AVATAR",
    ],
};
