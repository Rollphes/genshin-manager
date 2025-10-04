// To parse this data:
//
//   import { Convert } from "./file";
//
//   const avatarSkillExcelConfigDataType = Convert.toAvatarSkillExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type AvatarSkillExcelConfigDataType = {
    abilityName:          string;
    ADICEIPFANB:          boolean;
    AMIDJEIFHDL:          boolean;
    BFOPGOPPDAO:          boolean;
    buffIcon:             BuffIcon;
    cdSlot:               number;
    cdTime:               number;
    costElemType:         CostElemType;
    costElemVal:          number;
    costStamina:          number;
    descTextMapHash:      number;
    dragType:             DragType;
    EHHLOCMOEGC:          boolean;
    energyMin:            number;
    extraDescTextMapHash: number;
    GGAFPEMGCPM:          boolean;
    GHCNBMAPHML:          number;
    globalValueKey:       GlobalValueKey;
    id:                   number;
    IHFACGBENMJ:          Ihfacgbenmj;
    isAttackCameraLock:   boolean;
    JEGJLMPGMLP:          boolean;
    LHBMMBJBPMH:          boolean;
    LNEGGCDIDCP:          number;
    lockShape:            LockShape;
    lockWeightParams:     number[];
    maxChargeNum:         number;
    nameTextMapHash:      number;
    NCFNCHOJDGI:          boolean;
    needMonitor:          NeedMonitor;
    NGMJPKHBMNI:          boolean;
    OHFALENFJNH:          boolean;
    proudSkillGroupId:    number;
    shareCDID:            number;
    skillIcon:            string;
    triggerID:            number;
}

export enum Ihfacgbenmj {
    SpecialEnergyMavuika = "SPECIAL_ENERGY_MAVUIKA",
    SpecialEnergyNone = "SPECIAL_ENERGY_NONE",
    SpecialEnergySkirk = "SPECIAL_ENERGY_SKIRK",
}

export enum BuffIcon {
    Empty = "",
    SkillBBarbara01 = "Skill_B_Barbara_01",
}

export enum CostElemType {
    Electric = "Electric",
    Fire = "Fire",
    Grass = "Grass",
    Ice = "Ice",
    None = "None",
    Rock = "Rock",
    Water = "Water",
    Wind = "Wind",
}

export enum DragType {
    DragNone = "DRAG_NONE",
    DragRotateCamera = "DRAG_ROTATE_CAMERA",
    DragRotateCharacter = "DRAG_ROTATE_CHARACTER",
}

export enum GlobalValueKey {
    AVATARMagnetAbsorbSkill = "AVATAR_MagnetAbsorbSkill",
    AVATARMagnetThrowSkill = "AVATAR_MagnetThrowSkill",
    AVATARSelectLauncherTargetCharge = "AVATAR_Select_Launcher_Target_Charge",
    Avatar6_0_QuestEnergy = "AVATAR_6_0_QUEST_ENERGY",
    AvatarBlockingEnergy = "AVATAR_BLOCKING_ENERGY",
    AvatarBlockingMikawaflowerEnergy = "AVATAR_BLOCKING_MIKAWAFLOWER_ENERGY",
    AvatarBreakoutEnergy = "AVATAR_BREAKOUT_ENERGY",
    AvatarDiveEnergy = "AVATAR_DIVE_ENERGY",
    AvatarGlidingEnergy = "AVATAR_GLIDING_ENERGY",
    AvatarInazumaBadmintonHuge = "AVATAR_INAZUMA_BADMINTON_HUGE",
    AvatarLanv3RaceEnergy = "AVATAR_LANV3RACE_ENERGY",
    AvatarMvmEnergy = "AVATAR_MVM_ENERGY",
    AvatarSeekandhideEnergy = "AVATAR_SEEKANDHIDE_ENERGY",
    Empty = "",
    FlyingSquirrelFlyEnergy = "Flying_Squirrel_FlyEnergy",
    OrigamiSquirrelReturnEnergy = "OrigamiSquirrel_Return_Energy",
    TeamAntiKillEnergy = "TEAM_ANTI_KILL_ENERGY",
}

export enum LockShape {
    CircleLockEnemy = "CircleLockEnemy",
    CircleLockEnemyAmborFly = "CircleLockEnemyAmborFly",
    CircleLockEnemyR10 = "CircleLockEnemyR10",
    CircleLockEnemyR10H6HC = "CircleLockEnemyR10H6HC",
    CircleLockEnemyR12H14HC = "CircleLockEnemyR12H14HC",
    CircleLockEnemyR15H10HC = "CircleLockEnemyR15H10HC",
    CircleLockEnemyR25H10HC = "CircleLockEnemyR25H10HC",
    CircleLockEnemyR5H10HC = "CircleLockEnemyR5H10HC",
    CircleLockEnemyR5H6HC = "CircleLockEnemyR5H6HC",
    CircleLockEnemyR7H6HC = "CircleLockEnemyR7H6HC",
    CircleLockEnemyR8H6HC = "CircleLockEnemyR8H6HC",
    CircleR25H20HC = "CircleR25H20HC",
}

export enum NeedMonitor {
    MonitorNever = "MONITOR_NEVER",
    MonitorOffStage = "MONITOR_OFF_STAGE",
    MonitorOnStage = "MONITOR_ON_STAGE",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAvatarSkillExcelConfigDataType(json: string): AvatarSkillExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("AvatarSkillExcelConfigDataType")));
    }

    public static avatarSkillExcelConfigDataTypeToJson(value: AvatarSkillExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("AvatarSkillExcelConfigDataType"))), null, 2);
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
    "AvatarSkillExcelConfigDataType": o([
        { json: "abilityName", js: "abilityName", typ: "" },
        { json: "ADICEIPFANB", js: "ADICEIPFANB", typ: true },
        { json: "AMIDJEIFHDL", js: "AMIDJEIFHDL", typ: true },
        { json: "BFOPGOPPDAO", js: "BFOPGOPPDAO", typ: true },
        { json: "buffIcon", js: "buffIcon", typ: r("BuffIcon") },
        { json: "cdSlot", js: "cdSlot", typ: 0 },
        { json: "cdTime", js: "cdTime", typ: 3.14 },
        { json: "costElemType", js: "costElemType", typ: r("CostElemType") },
        { json: "costElemVal", js: "costElemVal", typ: 0 },
        { json: "costStamina", js: "costStamina", typ: 0 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "dragType", js: "dragType", typ: r("DragType") },
        { json: "EHHLOCMOEGC", js: "EHHLOCMOEGC", typ: true },
        { json: "energyMin", js: "energyMin", typ: 0 },
        { json: "extraDescTextMapHash", js: "extraDescTextMapHash", typ: 0 },
        { json: "GGAFPEMGCPM", js: "GGAFPEMGCPM", typ: true },
        { json: "GHCNBMAPHML", js: "GHCNBMAPHML", typ: 0 },
        { json: "globalValueKey", js: "globalValueKey", typ: r("GlobalValueKey") },
        { json: "id", js: "id", typ: 0 },
        { json: "IHFACGBENMJ", js: "IHFACGBENMJ", typ: r("Ihfacgbenmj") },
        { json: "isAttackCameraLock", js: "isAttackCameraLock", typ: true },
        { json: "JEGJLMPGMLP", js: "JEGJLMPGMLP", typ: true },
        { json: "LHBMMBJBPMH", js: "LHBMMBJBPMH", typ: true },
        { json: "LNEGGCDIDCP", js: "LNEGGCDIDCP", typ: 0 },
        { json: "lockShape", js: "lockShape", typ: r("LockShape") },
        { json: "lockWeightParams", js: "lockWeightParams", typ: a(3.14) },
        { json: "maxChargeNum", js: "maxChargeNum", typ: 0 },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "NCFNCHOJDGI", js: "NCFNCHOJDGI", typ: true },
        { json: "needMonitor", js: "needMonitor", typ: r("NeedMonitor") },
        { json: "NGMJPKHBMNI", js: "NGMJPKHBMNI", typ: true },
        { json: "OHFALENFJNH", js: "OHFALENFJNH", typ: true },
        { json: "proudSkillGroupId", js: "proudSkillGroupId", typ: 0 },
        { json: "shareCDID", js: "shareCDID", typ: 0 },
        { json: "skillIcon", js: "skillIcon", typ: "" },
        { json: "triggerID", js: "triggerID", typ: 0 },
    ], false),
    "Ihfacgbenmj": [
        "SPECIAL_ENERGY_MAVUIKA",
        "SPECIAL_ENERGY_NONE",
        "SPECIAL_ENERGY_SKIRK",
    ],
    "BuffIcon": [
        "",
        "Skill_B_Barbara_01",
    ],
    "CostElemType": [
        "Electric",
        "Fire",
        "Grass",
        "Ice",
        "None",
        "Rock",
        "Water",
        "Wind",
    ],
    "DragType": [
        "DRAG_NONE",
        "DRAG_ROTATE_CAMERA",
        "DRAG_ROTATE_CHARACTER",
    ],
    "GlobalValueKey": [
        "AVATAR_MagnetAbsorbSkill",
        "AVATAR_MagnetThrowSkill",
        "AVATAR_Select_Launcher_Target_Charge",
        "AVATAR_6_0_QUEST_ENERGY",
        "AVATAR_BLOCKING_ENERGY",
        "AVATAR_BLOCKING_MIKAWAFLOWER_ENERGY",
        "AVATAR_BREAKOUT_ENERGY",
        "AVATAR_DIVE_ENERGY",
        "AVATAR_GLIDING_ENERGY",
        "AVATAR_INAZUMA_BADMINTON_HUGE",
        "AVATAR_LANV3RACE_ENERGY",
        "AVATAR_MVM_ENERGY",
        "AVATAR_SEEKANDHIDE_ENERGY",
        "",
        "Flying_Squirrel_FlyEnergy",
        "OrigamiSquirrel_Return_Energy",
        "TEAM_ANTI_KILL_ENERGY",
    ],
    "LockShape": [
        "CircleLockEnemy",
        "CircleLockEnemyAmborFly",
        "CircleLockEnemyR10",
        "CircleLockEnemyR10H6HC",
        "CircleLockEnemyR12H14HC",
        "CircleLockEnemyR15H10HC",
        "CircleLockEnemyR25H10HC",
        "CircleLockEnemyR5H10HC",
        "CircleLockEnemyR5H6HC",
        "CircleLockEnemyR7H6HC",
        "CircleLockEnemyR8H6HC",
        "CircleR25H20HC",
    ],
    "NeedMonitor": [
        "MONITOR_NEVER",
        "MONITOR_OFF_STAGE",
        "MONITOR_ON_STAGE",
    ],
};
