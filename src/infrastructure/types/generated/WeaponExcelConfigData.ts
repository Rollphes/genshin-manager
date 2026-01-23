// To parse this data:
//
//   import { Convert } from "./file";
//
//   const weaponExcelConfigDataType = Convert.toWeaponExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type WeaponExcelConfigDataType = {
    awakenCosts:                number[];
    awakenIcon:                 string;
    awakenLightMapTexture:      string;
    awakenMaterial:             number;
    awakenTexture:              string;
    PDAEIKHKCBP:                Pdaeikhkcbp;
    descTextMapHash:            number;
    destroyReturnMaterial:      number[];
    destroyReturnMaterialCount: number[];
    destroyRule:                DestroyRule;
    dropable:                   boolean;
    gachaCardNameHash:          number;
    gadgetId:                   number;
    DLIALKLHDED:                number;
    globalItemLimit:            number;
    icon:                       string;
    id:                         number;
    KCCFDAFPBCI:                boolean;
    initialLockState:           number;
    itemType:                   ItemType;
    materialType:               MaterialType;
    nameTextMapHash:            number;
    rank:                       number;
    rankLevel:                  number;
    skillAffix:                 number[];
    storyId:                    number;
    unRotate:                   boolean;
    useLevel:                   number;
    weaponBaseExp:              number;
    weaponPromoteId:            number;
    weaponProp:                 WeaponProp[];
    weaponType:                 WeaponType;
    weight:                     number;
}

export enum Pdaeikhkcbp {
    None = "None",
}

export enum DestroyRule {
    DestroyNone = "DESTROY_NONE",
    DestroyReturnMaterial = "DESTROY_RETURN_MATERIAL",
}

export enum ItemType {
    ItemWeapon = "ITEM_WEAPON",
}

export enum MaterialType {
    WeaponMaterialNone = "WEAPON_MATERIAL_NONE",
}

export type WeaponProp = {
    initValue: number;
    propType:  PropType;
    type:      Type;
}

export enum PropType {
    FightPropAttackPercent = "FIGHT_PROP_ATTACK_PERCENT",
    FightPropBaseAttack = "FIGHT_PROP_BASE_ATTACK",
    FightPropChargeEfficiency = "FIGHT_PROP_CHARGE_EFFICIENCY",
    FightPropCritical = "FIGHT_PROP_CRITICAL",
    FightPropCriticalHurt = "FIGHT_PROP_CRITICAL_HURT",
    FightPropDefensePercent = "FIGHT_PROP_DEFENSE_PERCENT",
    FightPropElementMastery = "FIGHT_PROP_ELEMENT_MASTERY",
    FightPropHPPercent = "FIGHT_PROP_HP_PERCENT",
    FightPropNone = "FIGHT_PROP_NONE",
    FightPropPhysicalAddHurt = "FIGHT_PROP_PHYSICAL_ADD_HURT",
}

export enum Type {
    GrowCurveAttack101 = "GROW_CURVE_ATTACK_101",
    GrowCurveAttack102 = "GROW_CURVE_ATTACK_102",
    GrowCurveAttack104 = "GROW_CURVE_ATTACK_104",
    GrowCurveAttack201 = "GROW_CURVE_ATTACK_201",
    GrowCurveAttack202 = "GROW_CURVE_ATTACK_202",
    GrowCurveAttack203 = "GROW_CURVE_ATTACK_203",
    GrowCurveAttack204 = "GROW_CURVE_ATTACK_204",
    GrowCurveAttack301 = "GROW_CURVE_ATTACK_301",
    GrowCurveAttack302 = "GROW_CURVE_ATTACK_302",
    GrowCurveAttack303 = "GROW_CURVE_ATTACK_303",
    GrowCurveAttack304 = "GROW_CURVE_ATTACK_304",
    GrowCurveCritical101 = "GROW_CURVE_CRITICAL_101",
    GrowCurveCritical201 = "GROW_CURVE_CRITICAL_201",
    GrowCurveCritical301 = "GROW_CURVE_CRITICAL_301",
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
    public static toWeaponExcelConfigDataType(json: string): WeaponExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("WeaponExcelConfigDataType")));
    }

    public static weaponExcelConfigDataTypeToJson(value: WeaponExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("WeaponExcelConfigDataType"))), null, 2);
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
    "WeaponExcelConfigDataType": o([
        { json: "awakenCosts", js: "awakenCosts", typ: a(0) },
        { json: "awakenIcon", js: "awakenIcon", typ: "" },
        { json: "awakenLightMapTexture", js: "awakenLightMapTexture", typ: "" },
        { json: "awakenMaterial", js: "awakenMaterial", typ: 0 },
        { json: "awakenTexture", js: "awakenTexture", typ: "" },
        { json: "PDAEIKHKCBP", js: "PDAEIKHKCBP", typ: r("Pdaeikhkcbp") },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "destroyReturnMaterial", js: "destroyReturnMaterial", typ: a(0) },
        { json: "destroyReturnMaterialCount", js: "destroyReturnMaterialCount", typ: a(0) },
        { json: "destroyRule", js: "destroyRule", typ: r("DestroyRule") },
        { json: "dropable", js: "dropable", typ: true },
        { json: "gachaCardNameHash", js: "gachaCardNameHash", typ: 3.14 },
        { json: "gadgetId", js: "gadgetId", typ: 0 },
        { json: "DLIALKLHDED", js: "DLIALKLHDED", typ: 0 },
        { json: "globalItemLimit", js: "globalItemLimit", typ: 0 },
        { json: "icon", js: "icon", typ: "" },
        { json: "id", js: "id", typ: 0 },
        { json: "KCCFDAFPBCI", js: "KCCFDAFPBCI", typ: true },
        { json: "initialLockState", js: "initialLockState", typ: 0 },
        { json: "itemType", js: "itemType", typ: r("ItemType") },
        { json: "materialType", js: "materialType", typ: r("MaterialType") },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "rank", js: "rank", typ: 0 },
        { json: "rankLevel", js: "rankLevel", typ: 0 },
        { json: "skillAffix", js: "skillAffix", typ: a(0) },
        { json: "storyId", js: "storyId", typ: 0 },
        { json: "unRotate", js: "unRotate", typ: true },
        { json: "useLevel", js: "useLevel", typ: 0 },
        { json: "weaponBaseExp", js: "weaponBaseExp", typ: 0 },
        { json: "weaponPromoteId", js: "weaponPromoteId", typ: 0 },
        { json: "weaponProp", js: "weaponProp", typ: a(r("WeaponProp")) },
        { json: "weaponType", js: "weaponType", typ: r("WeaponType") },
        { json: "weight", js: "weight", typ: 0 },
    ], false),
    "WeaponProp": o([
        { json: "initValue", js: "initValue", typ: 3.14 },
        { json: "propType", js: "propType", typ: r("PropType") },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Pdaeikhkcbp": [
        "None",
    ],
    "DestroyRule": [
        "DESTROY_NONE",
        "DESTROY_RETURN_MATERIAL",
    ],
    "ItemType": [
        "ITEM_WEAPON",
    ],
    "MaterialType": [
        "WEAPON_MATERIAL_NONE",
    ],
    "PropType": [
        "FIGHT_PROP_ATTACK_PERCENT",
        "FIGHT_PROP_BASE_ATTACK",
        "FIGHT_PROP_CHARGE_EFFICIENCY",
        "FIGHT_PROP_CRITICAL",
        "FIGHT_PROP_CRITICAL_HURT",
        "FIGHT_PROP_DEFENSE_PERCENT",
        "FIGHT_PROP_ELEMENT_MASTERY",
        "FIGHT_PROP_HP_PERCENT",
        "FIGHT_PROP_NONE",
        "FIGHT_PROP_PHYSICAL_ADD_HURT",
    ],
    "Type": [
        "GROW_CURVE_ATTACK_101",
        "GROW_CURVE_ATTACK_102",
        "GROW_CURVE_ATTACK_104",
        "GROW_CURVE_ATTACK_201",
        "GROW_CURVE_ATTACK_202",
        "GROW_CURVE_ATTACK_203",
        "GROW_CURVE_ATTACK_204",
        "GROW_CURVE_ATTACK_301",
        "GROW_CURVE_ATTACK_302",
        "GROW_CURVE_ATTACK_303",
        "GROW_CURVE_ATTACK_304",
        "GROW_CURVE_CRITICAL_101",
        "GROW_CURVE_CRITICAL_201",
        "GROW_CURVE_CRITICAL_301",
    ],
    "WeaponType": [
        "WEAPON_BOW",
        "WEAPON_CATALYST",
        "WEAPON_CLAYMORE",
        "WEAPON_POLE",
        "WEAPON_SWORD_ONE_HAND",
    ],
};
