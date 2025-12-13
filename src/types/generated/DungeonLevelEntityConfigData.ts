// To parse this data:
//
//   import { Convert } from "./file";
//
//   const dungeonLevelEntityConfigDataType = Convert.toDungeonLevelEntityConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type DungeonLevelEntityConfigDataType = {
    abilityGroupName:       string;
    clientId:               number;
    descTextMapHash:        number;
    id:                     number;
    levelConfigName:        string;
    OHICBGIFKGF:            Ohicbgifkgf;
    show:                   boolean;
    switchTitleTextMapHash: number;
}

export enum Ohicbgifkgf {
    ActivityAbilityLevelBuffTowerBuffFireNormalAttackUp = "ActivityAbility_LevelBuff_TowerBuff_FireNormalAttackUp",
    ActivityAbilityLevelBuffTowerBuffNyxAttackUp = "ActivityAbility_LevelBuff_TowerBuff_NyxAttackUp",
    Empty = "",
    LevelBuffTowerBuffElemReactSwirlUp = "LevelBuff_TowerBuff_ElemReactSwirlUp",
    LevelBuffTowerBuffFallATKDamageUp6_2 = "LevelBuff_TowerBuff_FallATKDamageUp_6_2",
    LevelBuffTowerBuffFallingAttackUp = "LevelBuff_TowerBuff_FallingAttackUp",
    LevelBuffTowerBuffFireDamageUp6_2 = "LevelBuff_TowerBuff_FireDamageUp_6_2",
    LevelBuffTowerBuffGrassElementalArtUp = "LevelBuff_TowerBuff_GrassElementalArtUp",
    LevelBuffTowerBuffIceDamageUp = "LevelBuff_TowerBuff_IceDamageUp",
    LevelBuffTowerBuffIceElementalArtUp = "LevelBuff_TowerBuff_IceElementalArtUp",
    LevelBuffTowerBuffIceExtraAttackUp = "LevelBuff_TowerBuff_IceExtraAttackUp",
    LevelBuffTowerBuffIceNormalAttackUp = "LevelBuff_TowerBuff_IceNormalAttackUp",
    LevelBuffTowerBuffNoneEnergyDamageUp = "LevelBuff_TowerBuff_NoneEnergyDamageUp",
    LevelBuffTowerBuffOvergrowDamageUp6_0 = "LevelBuff_TowerBuff_OvergrowDamageUp_6_0",
    LevelBuffTowerBuffRockElementalArtUp = "LevelBuff_TowerBuff_RockElementalArtUp",
    LevelBuffTowerBuffShockDamageUp = "LevelBuff_TowerBuff_ShockDamageUp",
    LevelBuffTowerBuffShockDamageUp6_0 = "LevelBuff_TowerBuff_ShockDamageUp_6_0",
    LevelBuffTowerBuffTestFor533 = "LevelBuff_TowerBuff_TestFor53_3",
    LevelBuffTowerBuffTestFor534 = "LevelBuff_TowerBuff_TestFor53_4",
    LevelBuffTowerBuffWaterElementalArtUp = "LevelBuff_TowerBuff_WaterElementalArtUp",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDungeonLevelEntityConfigDataType(json: string): DungeonLevelEntityConfigDataType[] {
        return cast(JSON.parse(json), a(r("DungeonLevelEntityConfigDataType")));
    }

    public static dungeonLevelEntityConfigDataTypeToJson(value: DungeonLevelEntityConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("DungeonLevelEntityConfigDataType"))), null, 2);
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
    "DungeonLevelEntityConfigDataType": o([
        { json: "abilityGroupName", js: "abilityGroupName", typ: "" },
        { json: "clientId", js: "clientId", typ: 0 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "id", js: "id", typ: 0 },
        { json: "levelConfigName", js: "levelConfigName", typ: "" },
        { json: "OHICBGIFKGF", js: "OHICBGIFKGF", typ: r("Ohicbgifkgf") },
        { json: "show", js: "show", typ: true },
        { json: "switchTitleTextMapHash", js: "switchTitleTextMapHash", typ: 0 },
    ], false),
    "Ohicbgifkgf": [
        "ActivityAbility_LevelBuff_TowerBuff_FireNormalAttackUp",
        "ActivityAbility_LevelBuff_TowerBuff_NyxAttackUp",
        "",
        "LevelBuff_TowerBuff_ElemReactSwirlUp",
        "LevelBuff_TowerBuff_FallATKDamageUp_6_2",
        "LevelBuff_TowerBuff_FallingAttackUp",
        "LevelBuff_TowerBuff_FireDamageUp_6_2",
        "LevelBuff_TowerBuff_GrassElementalArtUp",
        "LevelBuff_TowerBuff_IceDamageUp",
        "LevelBuff_TowerBuff_IceElementalArtUp",
        "LevelBuff_TowerBuff_IceExtraAttackUp",
        "LevelBuff_TowerBuff_IceNormalAttackUp",
        "LevelBuff_TowerBuff_NoneEnergyDamageUp",
        "LevelBuff_TowerBuff_OvergrowDamageUp_6_0",
        "LevelBuff_TowerBuff_RockElementalArtUp",
        "LevelBuff_TowerBuff_ShockDamageUp",
        "LevelBuff_TowerBuff_ShockDamageUp_6_0",
        "LevelBuff_TowerBuff_TestFor53_3",
        "LevelBuff_TowerBuff_TestFor53_4",
        "LevelBuff_TowerBuff_WaterElementalArtUp",
    ],
};
