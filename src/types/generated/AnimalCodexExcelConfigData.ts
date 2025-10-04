// To parse this data:
//
//   import { Convert } from "./file";
//
//   const animalCodexExcelConfigDataType = Convert.toAnimalCodexExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type AnimalCodexExcelConfigDataType = {
    ABOAGOHLBID:      number[];
    countType:        CountType;
    describeId:       number;
    descTextMapHash:  number;
    id:               number;
    isDisuse:         boolean;
    isSeenActive:     boolean;
    LICBOMOOAFI:      number[];
    LJMGOHDNFMO:      number[];
    modelPath:        string;
    MPNCFOBMIDN:      number;
    OHCCAFLBIAJ:      number;
    pushTipsCodexId:  number;
    showOnlyUnlocked: boolean;
    sortOrder:        number;
    subType:          SubType;
    type:             Type;
}

export enum CountType {
    CodexCountTypeCapture = "CODEX_COUNT_TYPE_CAPTURE",
    CodexCountTypeFish = "CODEX_COUNT_TYPE_FISH",
    CodexCountTypeKill = "CODEX_COUNT_TYPE_KILL",
    CodexCountTypeNone = "CODEX_COUNT_TYPE_NONE",
}

export enum SubType {
    CodexSubtypeAbyss = "CODEX_SUBTYPE_ABYSS",
    CodexSubtypeAnimal = "CODEX_SUBTYPE_ANIMAL",
    CodexSubtypeAutomatron = "CODEX_SUBTYPE_AUTOMATRON",
    CodexSubtypeAviary = "CODEX_SUBTYPE_AVIARY",
    CodexSubtypeBeast = "CODEX_SUBTYPE_BEAST",
    CodexSubtypeBoss = "CODEX_SUBTYPE_BOSS",
    CodexSubtypeCritter = "CODEX_SUBTYPE_CRITTER",
    CodexSubtypeElemental = "CODEX_SUBTYPE_ELEMENTAL",
    CodexSubtypeFatui = "CODEX_SUBTYPE_FATUI",
    CodexSubtypeFish = "CODEX_SUBTYPE_FISH",
    CodexSubtypeHilichurl = "CODEX_SUBTYPE_HILICHURL",
    CodexSubtypeHuman = "CODEX_SUBTYPE_HUMAN",
}

export enum Type {
    CodexAnimal = "CODEX_ANIMAL",
    CodexMonster = "CODEX_MONSTER",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAnimalCodexExcelConfigDataType(json: string): AnimalCodexExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("AnimalCodexExcelConfigDataType")));
    }

    public static animalCodexExcelConfigDataTypeToJson(value: AnimalCodexExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("AnimalCodexExcelConfigDataType"))), null, 2);
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
    "AnimalCodexExcelConfigDataType": o([
        { json: "ABOAGOHLBID", js: "ABOAGOHLBID", typ: a(0) },
        { json: "countType", js: "countType", typ: r("CountType") },
        { json: "describeId", js: "describeId", typ: 0 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "id", js: "id", typ: 0 },
        { json: "isDisuse", js: "isDisuse", typ: true },
        { json: "isSeenActive", js: "isSeenActive", typ: true },
        { json: "LICBOMOOAFI", js: "LICBOMOOAFI", typ: a(0) },
        { json: "LJMGOHDNFMO", js: "LJMGOHDNFMO", typ: a(0) },
        { json: "modelPath", js: "modelPath", typ: "" },
        { json: "MPNCFOBMIDN", js: "MPNCFOBMIDN", typ: 3.14 },
        { json: "OHCCAFLBIAJ", js: "OHCCAFLBIAJ", typ: 0 },
        { json: "pushTipsCodexId", js: "pushTipsCodexId", typ: 0 },
        { json: "showOnlyUnlocked", js: "showOnlyUnlocked", typ: true },
        { json: "sortOrder", js: "sortOrder", typ: 0 },
        { json: "subType", js: "subType", typ: r("SubType") },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "CountType": [
        "CODEX_COUNT_TYPE_CAPTURE",
        "CODEX_COUNT_TYPE_FISH",
        "CODEX_COUNT_TYPE_KILL",
        "CODEX_COUNT_TYPE_NONE",
    ],
    "SubType": [
        "CODEX_SUBTYPE_ABYSS",
        "CODEX_SUBTYPE_ANIMAL",
        "CODEX_SUBTYPE_AUTOMATRON",
        "CODEX_SUBTYPE_AVIARY",
        "CODEX_SUBTYPE_BEAST",
        "CODEX_SUBTYPE_BOSS",
        "CODEX_SUBTYPE_CRITTER",
        "CODEX_SUBTYPE_ELEMENTAL",
        "CODEX_SUBTYPE_FATUI",
        "CODEX_SUBTYPE_FISH",
        "CODEX_SUBTYPE_HILICHURL",
        "CODEX_SUBTYPE_HUMAN",
    ],
    "Type": [
        "CODEX_ANIMAL",
        "CODEX_MONSTER",
    ],
};
