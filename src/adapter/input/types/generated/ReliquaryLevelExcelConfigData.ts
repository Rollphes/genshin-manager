// To parse this data:
//
//   import { Convert } from "./file";
//
//   const reliquaryLevelExcelConfigDataType = Convert.toReliquaryLevelExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type ReliquaryLevelExcelConfigDataType = {
    addProps: AddProp[];
    exp:      number;
    level:    number;
    rank:     number;
}

export type AddProp = {
    propType: PropType;
    value:    number;
}

export enum PropType {
    FightPropAttack = "FIGHT_PROP_ATTACK",
    FightPropAttackPercent = "FIGHT_PROP_ATTACK_PERCENT",
    FightPropChargeEfficiency = "FIGHT_PROP_CHARGE_EFFICIENCY",
    FightPropCritical = "FIGHT_PROP_CRITICAL",
    FightPropCriticalHurt = "FIGHT_PROP_CRITICAL_HURT",
    FightPropDefense = "FIGHT_PROP_DEFENSE",
    FightPropDefensePercent = "FIGHT_PROP_DEFENSE_PERCENT",
    FightPropElecAddHurt = "FIGHT_PROP_ELEC_ADD_HURT",
    FightPropElementMastery = "FIGHT_PROP_ELEMENT_MASTERY",
    FightPropFireAddHurt = "FIGHT_PROP_FIRE_ADD_HURT",
    FightPropFireSubHurt = "FIGHT_PROP_FIRE_SUB_HURT",
    FightPropGrassAddHurt = "FIGHT_PROP_GRASS_ADD_HURT",
    FightPropHP = "FIGHT_PROP_HP",
    FightPropHPPercent = "FIGHT_PROP_HP_PERCENT",
    FightPropHealAdd = "FIGHT_PROP_HEAL_ADD",
    FightPropIceAddHurt = "FIGHT_PROP_ICE_ADD_HURT",
    FightPropPhysicalAddHurt = "FIGHT_PROP_PHYSICAL_ADD_HURT",
    FightPropRockAddHurt = "FIGHT_PROP_ROCK_ADD_HURT",
    FightPropWaterAddHurt = "FIGHT_PROP_WATER_ADD_HURT",
    FightPropWindAddHurt = "FIGHT_PROP_WIND_ADD_HURT",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toReliquaryLevelExcelConfigDataType(json: string): ReliquaryLevelExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("ReliquaryLevelExcelConfigDataType")));
    }

    public static reliquaryLevelExcelConfigDataTypeToJson(value: ReliquaryLevelExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("ReliquaryLevelExcelConfigDataType"))), null, 2);
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
    "ReliquaryLevelExcelConfigDataType": o([
        { json: "addProps", js: "addProps", typ: a(r("AddProp")) },
        { json: "exp", js: "exp", typ: 0 },
        { json: "level", js: "level", typ: 0 },
        { json: "rank", js: "rank", typ: 0 },
    ], false),
    "AddProp": o([
        { json: "propType", js: "propType", typ: r("PropType") },
        { json: "value", js: "value", typ: 3.14 },
    ], false),
    "PropType": [
        "FIGHT_PROP_ATTACK",
        "FIGHT_PROP_ATTACK_PERCENT",
        "FIGHT_PROP_CHARGE_EFFICIENCY",
        "FIGHT_PROP_CRITICAL",
        "FIGHT_PROP_CRITICAL_HURT",
        "FIGHT_PROP_DEFENSE",
        "FIGHT_PROP_DEFENSE_PERCENT",
        "FIGHT_PROP_ELEC_ADD_HURT",
        "FIGHT_PROP_ELEMENT_MASTERY",
        "FIGHT_PROP_FIRE_ADD_HURT",
        "FIGHT_PROP_FIRE_SUB_HURT",
        "FIGHT_PROP_GRASS_ADD_HURT",
        "FIGHT_PROP_HP",
        "FIGHT_PROP_HP_PERCENT",
        "FIGHT_PROP_HEAL_ADD",
        "FIGHT_PROP_ICE_ADD_HURT",
        "FIGHT_PROP_PHYSICAL_ADD_HURT",
        "FIGHT_PROP_ROCK_ADD_HURT",
        "FIGHT_PROP_WATER_ADD_HURT",
        "FIGHT_PROP_WIND_ADD_HURT",
    ],
};
