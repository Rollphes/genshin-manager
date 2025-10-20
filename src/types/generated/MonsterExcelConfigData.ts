// To parse this data:
//
//   import { Convert } from "./file";
//
//   const monsterExcelConfigDataType = Convert.toMonsterExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type MonsterExcelConfigDataType = {
    affix:                    number[];
    ai:                       AI;
    attackBase:               number;
    campID:                   number;
    canSwim:                  boolean;
    CIAPMJAEIHD:              number;
    combatBGMLevel:           number;
    combatConfigHash:         number;
    controllerPathHash:       number;
    controllerPathRemoteHash: number;
    critical:                 number;
    criticalHurt:             number;
    defenseBase:              number;
    deformationMeshPathHash:  number;
    describeId:               number;
    elecSubHurt:              number;
    elementMastery:           number;
    entityBudgetLevel:        number;
    equips:                   number[];
    excludeWeathers:          ExcludeWeathers;
    FCAHMCPMPNP:              boolean;
    featureTagGroupID:        number;
    fireSubHurt:              number;
    grassSubHurt:             number;
    hideNameInElementView:    boolean;
    hpBase:                   number;
    hpDrops:                  HPDrop[];
    iceSubHurt:               number;
    id:                       number;
    IFNGBLPHINC:              number;
    ILDGFINBLII:              number;
    IOMANLCNFEO:              number;
    isAIHashCheck:            boolean;
    isInvisibleReset:         boolean;
    JEOILPDPBCF:              number;
    KGOGCJLGLNI:              number;
    killDropId:               number;
    lodPatternName:           LodPatternName;
    monsterName:              string;
    mpPropID:                 number;
    nameTextMapHash:          number;
    NCLJNCFOILK:              number;
    NKGIPKIAOGH:              number;
    PBJALANPDBD:              number;
    physicalSubHurt:          number;
    PJFIHJIKDDI:              number[];
    playType:                 PlayType;
    PPMJAMDEFFO:              Ppmjamdeffo;
    prefabPathHash:           number;
    prefabPathRagdollHash:    number;
    prefabPathRemoteHash:     number;
    propGrowCurves:           PropGrowCurve[];
    radarHintID:              number;
    rockSubHurt:              number;
    safetyCheck:              boolean;
    scriptDataPathHash:       number;
    securityLevel:            SecurityLevel;
    serverScript:             ServerScript;
    skin:                     string;
    type:                     MonsterExcelConfigDataTypeType;
    visionLevel:              VisionLevel;
    waterSubHurt:             number;
    windSubHurt:              number;
}

export enum Ppmjamdeffo {
    None = "None",
    Ousia = "Ousia",
    Pneuma = "Pneuma",
}

export enum AI {
    Assist01 = "assist01",
    Dragon01 = "dragon01",
    Empty = "",
    Playing = "playing",
    Ranged01 = "ranged01",
    Scout01 = "scout01",
    Sentry02 = "sentry02",
}

export enum ExcludeWeathers {
    Empty = "",
    雨雷雨雪 = "雨,雷雨,雪",
    雪 = "雪",
    雷雨雪 = "雷雨,雪",
}

export type HPDrop = {
    dropId:    number;
    hpPercent: number;
}

export enum LodPatternName {
    AnimalDefault01 = "Animal_Default_01",
    AnimalSpecial200_01 = "Animal_Special_200_01",
    AnimalSpecial20_01 = "Animal_Special_20_01",
    AnimalSpecial40_01 = "Animal_Special_40_01",
    Empty = "",
    MonsterBeydDefaultLod1 = "Monster_Beyd_Default_Lod1",
    MonsterBeydDefaultLod2 = "Monster_Beyd_Default_Lod2",
    MonsterDisplayFar = "Monster_DisplayFar",
    MonsterFlamingoNormalMigrate01 = "Monster_Flamingo_Normal_Migrate_01",
    MonsterGiantChessStage2 = "Monster_GiantChess_Stage2",
    MonsterNarcissusbornNarzissenkreuz01 = "Monster_Narcissusborn_Narzissenkreuz_01",
    MonsterRegisvineElectric01 = "Monster_Regisvine_Electric_01",
    MonsterShootingActivity01 = "Monster_ShootingActivity_01",
    MonsterSpecial200_01 = "Monster_Special_200_01",
    MonsterSpecialDragon01 = "Monster_Special_Dragon_01",
}

export enum PlayType {
    Beyond = "BEYOND",
    Default = "DEFAULT",
}

export type PropGrowCurve = {
    growCurve: GrowCurve;
    type:      PropGrowCurveType;
}

export enum GrowCurve {
    GrowCurveActivityAttack1 = "GROW_CURVE_ACTIVITY_ATTACK_1",
    GrowCurveActivityAttack2 = "GROW_CURVE_ACTIVITY_ATTACK_2",
    GrowCurveActivityDefense2 = "GROW_CURVE_ACTIVITY_DEFENSE_2",
    GrowCurveActivityHP1 = "GROW_CURVE_ACTIVITY_HP_1",
    GrowCurveActivityHP2 = "GROW_CURVE_ACTIVITY_HP_2",
    GrowCurveAttack = "GROW_CURVE_ATTACK",
    GrowCurveAttack2 = "GROW_CURVE_ATTACK_2",
    GrowCurveDefending = "GROW_CURVE_DEFENDING",
    GrowCurveDefense = "GROW_CURVE_DEFENSE",
    GrowCurveHP = "GROW_CURVE_HP",
    GrowCurveHP2 = "GROW_CURVE_HP_2",
    GrowCurveHPEnvironment = "GROW_CURVE_HP_ENVIRONMENT",
    GrowCurveHPLittlemonster = "GROW_CURVE_HP_LITTLEMONSTER",
    GrowCurveNone = "GROW_CURVE_NONE",
}

export enum PropGrowCurveType {
    FightPropBaseAttack = "FIGHT_PROP_BASE_ATTACK",
    FightPropBaseDefense = "FIGHT_PROP_BASE_DEFENSE",
    FightPropBaseHP = "FIGHT_PROP_BASE_HP",
    FightPropNone = "FIGHT_PROP_NONE",
}

export enum SecurityLevel {
    Boss = "BOSS",
    Elite = "ELITE",
    Normal = "NORMAL",
}

export enum ServerScript {
    Empty = "",
    SubFieldDropLightBall = "SubFieldDrop_LightBall",
    SubFieldDropMimikIce = "SubFieldDrop_Mimik_Ice",
    TestMoleMoraDrop = "Test_Mole_MoraDrop",
}

export enum MonsterExcelConfigDataTypeType {
    MonsterBoss = "MONSTER_BOSS",
    MonsterEnvAnimal = "MONSTER_ENV_ANIMAL",
    MonsterFish = "MONSTER_FISH",
    MonsterOrdinary = "MONSTER_ORDINARY",
    MonsterPartner = "MONSTER_PARTNER",
}

export enum VisionLevel {
    VisionLevelLittleRemote = "VISION_LEVEL_LITTLE_REMOTE",
    VisionLevelNearby = "VISION_LEVEL_NEARBY",
    VisionLevelNormal = "VISION_LEVEL_NORMAL",
    VisionLevelRemote = "VISION_LEVEL_REMOTE",
    VisionLevelSuper = "VISION_LEVEL_SUPER",
    VisionLevelSuperNearby = "VISION_LEVEL_SUPER_NEARBY",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMonsterExcelConfigDataType(json: string): MonsterExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("MonsterExcelConfigDataType")));
    }

    public static monsterExcelConfigDataTypeToJson(value: MonsterExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("MonsterExcelConfigDataType"))), null, 2);
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
    "MonsterExcelConfigDataType": o([
        { json: "affix", js: "affix", typ: a(0) },
        { json: "ai", js: "ai", typ: r("AI") },
        { json: "attackBase", js: "attackBase", typ: 3.14 },
        { json: "campID", js: "campID", typ: 0 },
        { json: "canSwim", js: "canSwim", typ: true },
        { json: "CIAPMJAEIHD", js: "CIAPMJAEIHD", typ: 0 },
        { json: "combatBGMLevel", js: "combatBGMLevel", typ: 0 },
        { json: "combatConfigHash", js: "combatConfigHash", typ: 3.14 },
        { json: "controllerPathHash", js: "controllerPathHash", typ: 3.14 },
        { json: "controllerPathRemoteHash", js: "controllerPathRemoteHash", typ: 3.14 },
        { json: "critical", js: "critical", typ: 0 },
        { json: "criticalHurt", js: "criticalHurt", typ: 0 },
        { json: "defenseBase", js: "defenseBase", typ: 0 },
        { json: "deformationMeshPathHash", js: "deformationMeshPathHash", typ: 3.14 },
        { json: "describeId", js: "describeId", typ: 0 },
        { json: "elecSubHurt", js: "elecSubHurt", typ: 3.14 },
        { json: "elementMastery", js: "elementMastery", typ: 0 },
        { json: "entityBudgetLevel", js: "entityBudgetLevel", typ: 0 },
        { json: "equips", js: "equips", typ: a(0) },
        { json: "excludeWeathers", js: "excludeWeathers", typ: r("ExcludeWeathers") },
        { json: "FCAHMCPMPNP", js: "FCAHMCPMPNP", typ: true },
        { json: "featureTagGroupID", js: "featureTagGroupID", typ: 0 },
        { json: "fireSubHurt", js: "fireSubHurt", typ: 3.14 },
        { json: "grassSubHurt", js: "grassSubHurt", typ: 3.14 },
        { json: "hideNameInElementView", js: "hideNameInElementView", typ: true },
        { json: "hpBase", js: "hpBase", typ: 3.14 },
        { json: "hpDrops", js: "hpDrops", typ: a(r("HPDrop")) },
        { json: "iceSubHurt", js: "iceSubHurt", typ: 3.14 },
        { json: "id", js: "id", typ: 0 },
        { json: "IFNGBLPHINC", js: "IFNGBLPHINC", typ: 0 },
        { json: "ILDGFINBLII", js: "ILDGFINBLII", typ: 0 },
        { json: "IOMANLCNFEO", js: "IOMANLCNFEO", typ: 0 },
        { json: "isAIHashCheck", js: "isAIHashCheck", typ: true },
        { json: "isInvisibleReset", js: "isInvisibleReset", typ: true },
        { json: "JEOILPDPBCF", js: "JEOILPDPBCF", typ: 0 },
        { json: "KGOGCJLGLNI", js: "KGOGCJLGLNI", typ: 0 },
        { json: "killDropId", js: "killDropId", typ: 0 },
        { json: "lodPatternName", js: "lodPatternName", typ: r("LodPatternName") },
        { json: "monsterName", js: "monsterName", typ: "" },
        { json: "mpPropID", js: "mpPropID", typ: 0 },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "NCLJNCFOILK", js: "NCLJNCFOILK", typ: 0 },
        { json: "NKGIPKIAOGH", js: "NKGIPKIAOGH", typ: 0 },
        { json: "PBJALANPDBD", js: "PBJALANPDBD", typ: 0 },
        { json: "physicalSubHurt", js: "physicalSubHurt", typ: 3.14 },
        { json: "PJFIHJIKDDI", js: "PJFIHJIKDDI", typ: a(3.14) },
        { json: "playType", js: "playType", typ: r("PlayType") },
        { json: "PPMJAMDEFFO", js: "PPMJAMDEFFO", typ: r("Ppmjamdeffo") },
        { json: "prefabPathHash", js: "prefabPathHash", typ: 3.14 },
        { json: "prefabPathRagdollHash", js: "prefabPathRagdollHash", typ: 3.14 },
        { json: "prefabPathRemoteHash", js: "prefabPathRemoteHash", typ: 3.14 },
        { json: "propGrowCurves", js: "propGrowCurves", typ: a(r("PropGrowCurve")) },
        { json: "radarHintID", js: "radarHintID", typ: 0 },
        { json: "rockSubHurt", js: "rockSubHurt", typ: 3.14 },
        { json: "safetyCheck", js: "safetyCheck", typ: true },
        { json: "scriptDataPathHash", js: "scriptDataPathHash", typ: 3.14 },
        { json: "securityLevel", js: "securityLevel", typ: r("SecurityLevel") },
        { json: "serverScript", js: "serverScript", typ: r("ServerScript") },
        { json: "skin", js: "skin", typ: "" },
        { json: "type", js: "type", typ: r("MonsterExcelConfigDataTypeType") },
        { json: "visionLevel", js: "visionLevel", typ: r("VisionLevel") },
        { json: "waterSubHurt", js: "waterSubHurt", typ: 3.14 },
        { json: "windSubHurt", js: "windSubHurt", typ: 3.14 },
    ], false),
    "HPDrop": o([
        { json: "dropId", js: "dropId", typ: 0 },
        { json: "hpPercent", js: "hpPercent", typ: 0 },
    ], false),
    "PropGrowCurve": o([
        { json: "growCurve", js: "growCurve", typ: r("GrowCurve") },
        { json: "type", js: "type", typ: r("PropGrowCurveType") },
    ], false),
    "Ppmjamdeffo": [
        "None",
        "Ousia",
        "Pneuma",
    ],
    "AI": [
        "assist01",
        "dragon01",
        "",
        "playing",
        "ranged01",
        "scout01",
        "sentry02",
    ],
    "ExcludeWeathers": [
        "",
        "雨,雷雨,雪",
        "雪",
        "雷雨,雪",
    ],
    "LodPatternName": [
        "Animal_Default_01",
        "Animal_Special_200_01",
        "Animal_Special_20_01",
        "Animal_Special_40_01",
        "",
        "Monster_Beyd_Default_Lod1",
        "Monster_Beyd_Default_Lod2",
        "Monster_DisplayFar",
        "Monster_Flamingo_Normal_Migrate_01",
        "Monster_GiantChess_Stage2",
        "Monster_Narcissusborn_Narzissenkreuz_01",
        "Monster_Regisvine_Electric_01",
        "Monster_ShootingActivity_01",
        "Monster_Special_200_01",
        "Monster_Special_Dragon_01",
    ],
    "PlayType": [
        "BEYOND",
        "DEFAULT",
    ],
    "GrowCurve": [
        "GROW_CURVE_ACTIVITY_ATTACK_1",
        "GROW_CURVE_ACTIVITY_ATTACK_2",
        "GROW_CURVE_ACTIVITY_DEFENSE_2",
        "GROW_CURVE_ACTIVITY_HP_1",
        "GROW_CURVE_ACTIVITY_HP_2",
        "GROW_CURVE_ATTACK",
        "GROW_CURVE_ATTACK_2",
        "GROW_CURVE_DEFENDING",
        "GROW_CURVE_DEFENSE",
        "GROW_CURVE_HP",
        "GROW_CURVE_HP_2",
        "GROW_CURVE_HP_ENVIRONMENT",
        "GROW_CURVE_HP_LITTLEMONSTER",
        "GROW_CURVE_NONE",
    ],
    "PropGrowCurveType": [
        "FIGHT_PROP_BASE_ATTACK",
        "FIGHT_PROP_BASE_DEFENSE",
        "FIGHT_PROP_BASE_HP",
        "FIGHT_PROP_NONE",
    ],
    "SecurityLevel": [
        "BOSS",
        "ELITE",
        "NORMAL",
    ],
    "ServerScript": [
        "",
        "SubFieldDrop_LightBall",
        "SubFieldDrop_Mimik_Ice",
        "Test_Mole_MoraDrop",
    ],
    "MonsterExcelConfigDataTypeType": [
        "MONSTER_BOSS",
        "MONSTER_ENV_ANIMAL",
        "MONSTER_FISH",
        "MONSTER_ORDINARY",
        "MONSTER_PARTNER",
    ],
    "VisionLevel": [
        "VISION_LEVEL_LITTLE_REMOTE",
        "VISION_LEVEL_NEARBY",
        "VISION_LEVEL_NORMAL",
        "VISION_LEVEL_REMOTE",
        "VISION_LEVEL_SUPER",
        "VISION_LEVEL_SUPER_NEARBY",
    ],
};
