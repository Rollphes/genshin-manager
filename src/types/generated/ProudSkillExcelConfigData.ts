// To parse this data:
//
//   import { Convert } from "./file";
//
//   const proudSkillExcelConfigDataType = Convert.toProudSkillExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type ProudSkillExcelConfigDataType = {
    addProps:              AddProp[];
    breakLevel:            number;
    coinCost:              number;
    descTextMapHash:       number;
    filterConds:           FilterCond[];
    HFOHLKDEJPO:           Hfohlkdejpo;
    icon:                  string;
    isHideLifeProudSkill:  boolean;
    costItems:             CostItem[];
    level:                 number;
    lifeEffectParams:      string[];
    lifeEffectType:        LifeEffectType;
    nameTextMapHash:       number;
    OJAOOFGBGJI:           Ojaoofgbgji;
    openConfig:            string;
    paramDescList:         number[];
    paramList:             number[];
    proudSkillGroupId:     number;
    proudSkillId:          number;
    proudSkillType:        number;
    unlockDescTextMapHash: number;
}

export enum Hfohlkdejpo {
    ProudSkillDisplayBreak = "PROUD_SKILL_DISPLAY_BREAK",
    ProudSkillDisplayDefault = "PROUD_SKILL_DISPLAY_DEFAULT",
}

export type Ojaoofgbgji = {
    value: number;
}

export type AddProp = {
    propType: PropType;
    value:    number;
}

export enum PropType {
    FightPropCritical = "FIGHT_PROP_CRITICAL",
    FightPropHealAdd = "FIGHT_PROP_HEAL_ADD",
    FightPropNone = "FIGHT_PROP_NONE",
    FightPropWaterAddHurt = "FIGHT_PROP_WATER_ADD_HURT",
}

export type CostItem = {
    count: number;
    id:    number;
}

export enum FilterCond {
    TalentFilterNone = "TALENT_FILTER_NONE",
}

export enum LifeEffectType {
    ProudEffectCombineMultiplyOutput = "PROUD_EFFECT_COMBINE_MULTIPLY_OUTPUT",
    ProudEffectCombineReturnMaterial = "PROUD_EFFECT_COMBINE_RETURN_MATERIAL",
    ProudEffectCombineReturnSpecialMaterial = "PROUD_EFFECT_COMBINE_RETURN_SPECIAL_MATERIAL",
    ProudEffectCookCanNotCook = "PROUD_EFFECT_COOK_CAN_NOT_COOK",
    ProudEffectCookPerfectMultiOutput = "PROUD_EFFECT_COOK_PERFECT_MULTI_OUTPUT",
    ProudEffectCookProbMultiOutput = "PROUD_EFFECT_COOK_PROB_MULTI_OUTPUT",
    ProudEffectExpeditionExtraOutput = "PROUD_EFFECT_EXPEDITION_EXTRA_OUTPUT",
    ProudEffectExpeditionShortenTime = "PROUD_EFFECT_EXPEDITION_SHORTEN_TIME",
    ProudEffectFishingExtraOutput = "PROUD_EFFECT_FISHING_EXTRA_OUTPUT",
    ProudEffectForgeAddExtraProb = "PROUD_EFFECT_FORGE_ADD_EXTRA_PROB",
    ProudEffectForgeReduceTime = "PROUD_EFFECT_FORGE_REDUCE_TIME",
    ProudEffectForgeReturnMaterial = "PROUD_EFFECT_FORGE_RETURN_MATERIAL",
    ProudEffectFurnitureMakeReturnMaterial = "PROUD_EFFECT_FURNITURE_MAKE_RETURN_MATERIAL",
    ProudEffectHitTreeExtraOutput = "PROUD_EFFECT_HIT_TREE_EXTRA_OUTPUT",
    ProudEffectNone = "PROUD_EFFECT_NONE",
    ProudEffectUseFoodProbGetItem = "PROUD_EFFECT_USE_FOOD_PROB_GET_ITEM",
    ProudEffectWeaponPromoteReduceScoin = "PROUD_EFFECT_WEAPON_PROMOTE_REDUCE_SCOIN",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toProudSkillExcelConfigDataType(json: string): ProudSkillExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("ProudSkillExcelConfigDataType")));
    }

    public static proudSkillExcelConfigDataTypeToJson(value: ProudSkillExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("ProudSkillExcelConfigDataType"))), null, 2);
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
    "ProudSkillExcelConfigDataType": o([
        { json: "addProps", js: "addProps", typ: a(r("AddProp")) },
        { json: "breakLevel", js: "breakLevel", typ: 0 },
        { json: "coinCost", js: "coinCost", typ: 0 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "filterConds", js: "filterConds", typ: a(r("FilterCond")) },
        { json: "HFOHLKDEJPO", js: "HFOHLKDEJPO", typ: r("Hfohlkdejpo") },
        { json: "icon", js: "icon", typ: "" },
        { json: "isHideLifeProudSkill", js: "isHideLifeProudSkill", typ: true },
        { json: "costItems", js: "costItems", typ: a(r("CostItem")) },
        { json: "level", js: "level", typ: 0 },
        { json: "lifeEffectParams", js: "lifeEffectParams", typ: a("") },
        { json: "lifeEffectType", js: "lifeEffectType", typ: r("LifeEffectType") },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "OJAOOFGBGJI", js: "OJAOOFGBGJI", typ: r("Ojaoofgbgji") },
        { json: "openConfig", js: "openConfig", typ: "" },
        { json: "paramDescList", js: "paramDescList", typ: a(0) },
        { json: "paramList", js: "paramList", typ: a(3.14) },
        { json: "proudSkillGroupId", js: "proudSkillGroupId", typ: 0 },
        { json: "proudSkillId", js: "proudSkillId", typ: 0 },
        { json: "proudSkillType", js: "proudSkillType", typ: 0 },
        { json: "unlockDescTextMapHash", js: "unlockDescTextMapHash", typ: 0 },
    ], false),
    "Ojaoofgbgji": o([
        { json: "value", js: "value", typ: 0 },
    ], false),
    "AddProp": o([
        { json: "propType", js: "propType", typ: r("PropType") },
        { json: "value", js: "value", typ: 3.14 },
    ], false),
    "CostItem": o([
        { json: "count", js: "count", typ: 0 },
        { json: "id", js: "id", typ: 0 },
    ], false),
    "Hfohlkdejpo": [
        "PROUD_SKILL_DISPLAY_BREAK",
        "PROUD_SKILL_DISPLAY_DEFAULT",
    ],
    "PropType": [
        "FIGHT_PROP_CRITICAL",
        "FIGHT_PROP_HEAL_ADD",
        "FIGHT_PROP_NONE",
        "FIGHT_PROP_WATER_ADD_HURT",
    ],
    "FilterCond": [
        "TALENT_FILTER_NONE",
    ],
    "LifeEffectType": [
        "PROUD_EFFECT_COMBINE_MULTIPLY_OUTPUT",
        "PROUD_EFFECT_COMBINE_RETURN_MATERIAL",
        "PROUD_EFFECT_COMBINE_RETURN_SPECIAL_MATERIAL",
        "PROUD_EFFECT_COOK_CAN_NOT_COOK",
        "PROUD_EFFECT_COOK_PERFECT_MULTI_OUTPUT",
        "PROUD_EFFECT_COOK_PROB_MULTI_OUTPUT",
        "PROUD_EFFECT_EXPEDITION_EXTRA_OUTPUT",
        "PROUD_EFFECT_EXPEDITION_SHORTEN_TIME",
        "PROUD_EFFECT_FISHING_EXTRA_OUTPUT",
        "PROUD_EFFECT_FORGE_ADD_EXTRA_PROB",
        "PROUD_EFFECT_FORGE_REDUCE_TIME",
        "PROUD_EFFECT_FORGE_RETURN_MATERIAL",
        "PROUD_EFFECT_FURNITURE_MAKE_RETURN_MATERIAL",
        "PROUD_EFFECT_HIT_TREE_EXTRA_OUTPUT",
        "PROUD_EFFECT_NONE",
        "PROUD_EFFECT_USE_FOOD_PROB_GET_ITEM",
        "PROUD_EFFECT_WEAPON_PROMOTE_REDUCE_SCOIN",
    ],
};
