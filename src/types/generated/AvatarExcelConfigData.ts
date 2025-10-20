// To parse this data:
//
//   import { Convert } from "./file";
//
//   const avatarExcelConfigDataType = Convert.toAvatarExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type AvatarExcelConfigDataType = {
    animatorConfigPathHash:         number;
    attackBase:                     number;
    avatarIdentityType:             AvatarIdentityType;
    avatarPromoteId:                number;
    avatarPromoteRewardIdList:      number[];
    avatarPromoteRewardLevelList:   number[];
    BDKICGKLCMA:                    number;
    bodyType:                       BodyType;
    campID:                         number;
    candSkillDepotIds:              number[];
    CDBLKEGMAEN:                    boolean;
    chargeEfficiency:               number;
    CIAPMJAEIHD:                    number;
    CMHFEAFOLPG:                    number;
    combatConfigHash:               number;
    controllerPathHash:             number;
    controllerPathRemoteHash:       number;
    coopPicNameHash:                number;
    critical:                       number;
    criticalHurt:                   number;
    defenseBase:                    number;
    deformationMeshPathHash:        number;
    descTextMapHash:                number;
    EFBDEAEJMNJ:                    number;
    elecSubHurt:                    number;
    elementMastery:                 number;
    EPBCFFKHAIM:                    Epbcffkhaim;
    featureTagGroupID:              number;
    fireSubHurt:                    number;
    gachaCardNameHash:              number;
    gachaImageNameHash:             number;
    GDACAJPIPCJ:                    boolean;
    GPHICMPCPFA:                    number;
    grassSubHurt:                   number;
    HCHFHPEKGHO:                    number;
    HDJEMKFONAD:                    number;
    HGJCAPNOMAA:                    number;
    HINKMCLODHL:                    number;
    hpBase:                         number;
    iceSubHurt:                     number;
    iconName:                       string;
    id:                             number;
    IFNGBLPHINC:                    number;
    IJIPDMJLGNB:                    number;
    ILDGFINBLII:                    number;
    imageName:                      string;
    initialWeapon:                  number;
    IOMANLCNFEO:                    number;
    isRangeAttack:                  boolean;
    JEOILPDPBCF:                    number;
    KBGIKODHDPA:                    Epbcffkhaim;
    KGOGCJLGLNI:                    number;
    LLPAFFFGFBP:                    number;
    lodPatternName:                 string;
    MAEJJKELOBK:                    number;
    manekinJsonConfigHash:          number;
    manekinMotionConfig:            number;
    manekinPathHash:                number;
    MOCNCNMLBHE:                    string;
    nameTextMapHash:                number;
    NCLJNCFOILK:                    number;
    NKGIPKIAOGH:                    number;
    NOCDAKPNGFO:                    number;
    PBJALANPDBD:                    number;
    PDKIEBDGBCC:                    Epbcffkhaim;
    physicalSubHurt:                number;
    POKAEPFKOLI:                    number;
    prefabPathHash:                 number;
    prefabPathRagdollHash:          number;
    prefabPathRemoteHash:           number;
    propGrowCurves:                 PropGrowCurve[];
    qualityType:                    QualityType;
    rockSubHurt:                    number;
    scriptDataPathHash:             number;
    sideIconName:                   string;
    skillDepotId:                   number;
    specialDeformationMeshPathHash: number;
    staminaRecoverSpeed:            number;
    useType:                        UseType;
    waterSubHurt:                   number;
    weaponType:                     WeaponType;
    windSubHurt:                    number;
}

export enum Epbcffkhaim {
    FightPropAttackPercent = "FIGHT_PROP_ATTACK_PERCENT",
    FightPropChargeEfficiency = "FIGHT_PROP_CHARGE_EFFICIENCY",
    FightPropCritical = "FIGHT_PROP_CRITICAL",
    FightPropCriticalHurt = "FIGHT_PROP_CRITICAL_HURT",
    FightPropDefensePercent = "FIGHT_PROP_DEFENSE_PERCENT",
    FightPropElementMastery = "FIGHT_PROP_ELEMENT_MASTERY",
    FightPropHPPercent = "FIGHT_PROP_HP_PERCENT",
    FightPropNone = "FIGHT_PROP_NONE",
    FightPropPhysicalAddHurt = "FIGHT_PROP_PHYSICAL_ADD_HURT",
}

export enum AvatarIdentityType {
    AvatarIdentityMaster = "AVATAR_IDENTITY_MASTER",
    AvatarIdentityNormal = "AVATAR_IDENTITY_NORMAL",
}

export enum BodyType {
    BodyBoy = "BODY_BOY",
    BodyGirl = "BODY_GIRL",
    BodyLady = "BODY_LADY",
    BodyLoli = "BODY_LOLI",
    BodyMale = "BODY_MALE",
}

export type PropGrowCurve = {
    growCurve: GrowCurve;
    type:      Type;
}

export enum GrowCurve {
    GrowCurveAttackS4 = "GROW_CURVE_ATTACK_S4",
    GrowCurveAttackS5 = "GROW_CURVE_ATTACK_S5",
    GrowCurveHPS4 = "GROW_CURVE_HP_S4",
    GrowCurveHPS5 = "GROW_CURVE_HP_S5",
}

export enum Type {
    FightPropBaseAttack = "FIGHT_PROP_BASE_ATTACK",
    FightPropBaseDefense = "FIGHT_PROP_BASE_DEFENSE",
    FightPropBaseHP = "FIGHT_PROP_BASE_HP",
}

export enum QualityType {
    QualityOrange = "QUALITY_ORANGE",
    QualityOrangeSP = "QUALITY_ORANGE_SP",
    QualityPurple = "QUALITY_PURPLE",
}

export enum UseType {
    AvatarAbandon = "AVATAR_ABANDON",
    AvatarFormal = "AVATAR_FORMAL",
    AvatarSyncTest = "AVATAR_SYNC_TEST",
    AvatarTest = "AVATAR_TEST",
}

export enum WeaponType {
    WeaponBow = "WEAPON_BOW",
    WeaponCatalyst = "WEAPON_CATALYST",
    WeaponClaymore = "WEAPON_CLAYMORE",
    WeaponPole = "WEAPON_POLE",
    WeaponSwordOneHand = "WEAPON_SWORD_ONE_HAND",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAvatarExcelConfigDataType(json: string): AvatarExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("AvatarExcelConfigDataType")));
    }

    public static avatarExcelConfigDataTypeToJson(value: AvatarExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("AvatarExcelConfigDataType"))), null, 2);
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
    "AvatarExcelConfigDataType": o([
        { json: "animatorConfigPathHash", js: "animatorConfigPathHash", typ: 3.14 },
        { json: "attackBase", js: "attackBase", typ: 3.14 },
        { json: "avatarIdentityType", js: "avatarIdentityType", typ: r("AvatarIdentityType") },
        { json: "avatarPromoteId", js: "avatarPromoteId", typ: 0 },
        { json: "avatarPromoteRewardIdList", js: "avatarPromoteRewardIdList", typ: a(0) },
        { json: "avatarPromoteRewardLevelList", js: "avatarPromoteRewardLevelList", typ: a(0) },
        { json: "BDKICGKLCMA", js: "BDKICGKLCMA", typ: 3.14 },
        { json: "bodyType", js: "bodyType", typ: r("BodyType") },
        { json: "campID", js: "campID", typ: 0 },
        { json: "candSkillDepotIds", js: "candSkillDepotIds", typ: a(0) },
        { json: "CDBLKEGMAEN", js: "CDBLKEGMAEN", typ: true },
        { json: "chargeEfficiency", js: "chargeEfficiency", typ: 0 },
        { json: "CIAPMJAEIHD", js: "CIAPMJAEIHD", typ: 0 },
        { json: "CMHFEAFOLPG", js: "CMHFEAFOLPG", typ: 0 },
        { json: "combatConfigHash", js: "combatConfigHash", typ: 3.14 },
        { json: "controllerPathHash", js: "controllerPathHash", typ: 3.14 },
        { json: "controllerPathRemoteHash", js: "controllerPathRemoteHash", typ: 3.14 },
        { json: "coopPicNameHash", js: "coopPicNameHash", typ: 3.14 },
        { json: "critical", js: "critical", typ: 3.14 },
        { json: "criticalHurt", js: "criticalHurt", typ: 3.14 },
        { json: "defenseBase", js: "defenseBase", typ: 3.14 },
        { json: "deformationMeshPathHash", js: "deformationMeshPathHash", typ: 3.14 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "EFBDEAEJMNJ", js: "EFBDEAEJMNJ", typ: 3.14 },
        { json: "elecSubHurt", js: "elecSubHurt", typ: 0 },
        { json: "elementMastery", js: "elementMastery", typ: 0 },
        { json: "EPBCFFKHAIM", js: "EPBCFFKHAIM", typ: r("Epbcffkhaim") },
        { json: "featureTagGroupID", js: "featureTagGroupID", typ: 0 },
        { json: "fireSubHurt", js: "fireSubHurt", typ: 0 },
        { json: "gachaCardNameHash", js: "gachaCardNameHash", typ: 3.14 },
        { json: "gachaImageNameHash", js: "gachaImageNameHash", typ: 3.14 },
        { json: "GDACAJPIPCJ", js: "GDACAJPIPCJ", typ: true },
        { json: "GPHICMPCPFA", js: "GPHICMPCPFA", typ: 0 },
        { json: "grassSubHurt", js: "grassSubHurt", typ: 0 },
        { json: "HCHFHPEKGHO", js: "HCHFHPEKGHO", typ: 3.14 },
        { json: "HDJEMKFONAD", js: "HDJEMKFONAD", typ: 0 },
        { json: "HGJCAPNOMAA", js: "HGJCAPNOMAA", typ: 3.14 },
        { json: "HINKMCLODHL", js: "HINKMCLODHL", typ: 3.14 },
        { json: "hpBase", js: "hpBase", typ: 3.14 },
        { json: "iceSubHurt", js: "iceSubHurt", typ: 0 },
        { json: "iconName", js: "iconName", typ: "" },
        { json: "id", js: "id", typ: 0 },
        { json: "IFNGBLPHINC", js: "IFNGBLPHINC", typ: 0 },
        { json: "IJIPDMJLGNB", js: "IJIPDMJLGNB", typ: 3.14 },
        { json: "ILDGFINBLII", js: "ILDGFINBLII", typ: 0 },
        { json: "imageName", js: "imageName", typ: "" },
        { json: "initialWeapon", js: "initialWeapon", typ: 0 },
        { json: "IOMANLCNFEO", js: "IOMANLCNFEO", typ: 0 },
        { json: "isRangeAttack", js: "isRangeAttack", typ: true },
        { json: "JEOILPDPBCF", js: "JEOILPDPBCF", typ: 0 },
        { json: "KBGIKODHDPA", js: "KBGIKODHDPA", typ: r("Epbcffkhaim") },
        { json: "KGOGCJLGLNI", js: "KGOGCJLGLNI", typ: 0 },
        { json: "LLPAFFFGFBP", js: "LLPAFFFGFBP", typ: 3.14 },
        { json: "lodPatternName", js: "lodPatternName", typ: "" },
        { json: "MAEJJKELOBK", js: "MAEJJKELOBK", typ: 3.14 },
        { json: "manekinJsonConfigHash", js: "manekinJsonConfigHash", typ: 3.14 },
        { json: "manekinMotionConfig", js: "manekinMotionConfig", typ: 0 },
        { json: "manekinPathHash", js: "manekinPathHash", typ: 3.14 },
        { json: "MOCNCNMLBHE", js: "MOCNCNMLBHE", typ: "" },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "NCLJNCFOILK", js: "NCLJNCFOILK", typ: 0 },
        { json: "NKGIPKIAOGH", js: "NKGIPKIAOGH", typ: 0 },
        { json: "NOCDAKPNGFO", js: "NOCDAKPNGFO", typ: 0 },
        { json: "PBJALANPDBD", js: "PBJALANPDBD", typ: 0 },
        { json: "PDKIEBDGBCC", js: "PDKIEBDGBCC", typ: r("Epbcffkhaim") },
        { json: "physicalSubHurt", js: "physicalSubHurt", typ: 0 },
        { json: "POKAEPFKOLI", js: "POKAEPFKOLI", typ: 0 },
        { json: "prefabPathHash", js: "prefabPathHash", typ: 3.14 },
        { json: "prefabPathRagdollHash", js: "prefabPathRagdollHash", typ: 3.14 },
        { json: "prefabPathRemoteHash", js: "prefabPathRemoteHash", typ: 3.14 },
        { json: "propGrowCurves", js: "propGrowCurves", typ: a(r("PropGrowCurve")) },
        { json: "qualityType", js: "qualityType", typ: r("QualityType") },
        { json: "rockSubHurt", js: "rockSubHurt", typ: 0 },
        { json: "scriptDataPathHash", js: "scriptDataPathHash", typ: 3.14 },
        { json: "sideIconName", js: "sideIconName", typ: "" },
        { json: "skillDepotId", js: "skillDepotId", typ: 0 },
        { json: "specialDeformationMeshPathHash", js: "specialDeformationMeshPathHash", typ: 3.14 },
        { json: "staminaRecoverSpeed", js: "staminaRecoverSpeed", typ: 0 },
        { json: "useType", js: "useType", typ: r("UseType") },
        { json: "waterSubHurt", js: "waterSubHurt", typ: 0 },
        { json: "weaponType", js: "weaponType", typ: r("WeaponType") },
        { json: "windSubHurt", js: "windSubHurt", typ: 0 },
    ], false),
    "PropGrowCurve": o([
        { json: "growCurve", js: "growCurve", typ: r("GrowCurve") },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Epbcffkhaim": [
        "FIGHT_PROP_ATTACK_PERCENT",
        "FIGHT_PROP_CHARGE_EFFICIENCY",
        "FIGHT_PROP_CRITICAL",
        "FIGHT_PROP_CRITICAL_HURT",
        "FIGHT_PROP_DEFENSE_PERCENT",
        "FIGHT_PROP_ELEMENT_MASTERY",
        "FIGHT_PROP_HP_PERCENT",
        "FIGHT_PROP_NONE",
        "FIGHT_PROP_PHYSICAL_ADD_HURT",
    ],
    "AvatarIdentityType": [
        "AVATAR_IDENTITY_MASTER",
        "AVATAR_IDENTITY_NORMAL",
    ],
    "BodyType": [
        "BODY_BOY",
        "BODY_GIRL",
        "BODY_LADY",
        "BODY_LOLI",
        "BODY_MALE",
    ],
    "GrowCurve": [
        "GROW_CURVE_ATTACK_S4",
        "GROW_CURVE_ATTACK_S5",
        "GROW_CURVE_HP_S4",
        "GROW_CURVE_HP_S5",
    ],
    "Type": [
        "FIGHT_PROP_BASE_ATTACK",
        "FIGHT_PROP_BASE_DEFENSE",
        "FIGHT_PROP_BASE_HP",
    ],
    "QualityType": [
        "QUALITY_ORANGE",
        "QUALITY_ORANGE_SP",
        "QUALITY_PURPLE",
    ],
    "UseType": [
        "AVATAR_ABANDON",
        "AVATAR_FORMAL",
        "AVATAR_SYNC_TEST",
        "AVATAR_TEST",
    ],
    "WeaponType": [
        "WEAPON_BOW",
        "WEAPON_CATALYST",
        "WEAPON_CLAYMORE",
        "WEAPON_POLE",
        "WEAPON_SWORD_ONE_HAND",
    ],
};
