// To parse this data:
//
//   import { Convert } from "./file";
//
//   const towerLevelExcelConfigDataType = Convert.toTowerLevelExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type TowerLevelExcelConfigDataType = {
    conds:                  Cond[];
    dungeonId:              number;
    firstMonsterList:       number[];
    firstPassRewardId:      number;
    GNNNGECFCAJ:            number;
    HAOBIOJEECA:            number;
    JDHIPBOALOD:            string;
    levelGroupId:           number;
    levelId:                number;
    levelIndex:             number;
    monsterLevel:           number;
    NKOPAOBMOLC:            number;
    secondMonsterList:      number[];
    towerBuffConfigStrList: string[];
}

export type Cond = {
    argumentList:      number[];
    argumentListUpper: number[];
    towerCondType:     TowerCondType;
}

export enum TowerCondType {
    TowerCondChallengeLeftTimeMoreThan = "TOWER_COND_CHALLENGE_LEFT_TIME_MORE_THAN",
    TowerCondLeftHPGreaterThan = "TOWER_COND_LEFT_HP_GREATER_THAN",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTowerLevelExcelConfigDataType(json: string): TowerLevelExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("TowerLevelExcelConfigDataType")));
    }

    public static towerLevelExcelConfigDataTypeToJson(value: TowerLevelExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("TowerLevelExcelConfigDataType"))), null, 2);
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
    "TowerLevelExcelConfigDataType": o([
        { json: "conds", js: "conds", typ: a(r("Cond")) },
        { json: "dungeonId", js: "dungeonId", typ: 0 },
        { json: "firstMonsterList", js: "firstMonsterList", typ: a(0) },
        { json: "firstPassRewardId", js: "firstPassRewardId", typ: 0 },
        { json: "GNNNGECFCAJ", js: "GNNNGECFCAJ", typ: 0 },
        { json: "HAOBIOJEECA", js: "HAOBIOJEECA", typ: 0 },
        { json: "JDHIPBOALOD", js: "JDHIPBOALOD", typ: "" },
        { json: "levelGroupId", js: "levelGroupId", typ: 0 },
        { json: "levelId", js: "levelId", typ: 0 },
        { json: "levelIndex", js: "levelIndex", typ: 0 },
        { json: "monsterLevel", js: "monsterLevel", typ: 0 },
        { json: "NKOPAOBMOLC", js: "NKOPAOBMOLC", typ: 0 },
        { json: "secondMonsterList", js: "secondMonsterList", typ: a(0) },
        { json: "towerBuffConfigStrList", js: "towerBuffConfigStrList", typ: a("") },
    ], false),
    "Cond": o([
        { json: "argumentList", js: "argumentList", typ: a(0) },
        { json: "argumentListUpper", js: "argumentListUpper", typ: a(0) },
        { json: "towerCondType", js: "towerCondType", typ: r("TowerCondType") },
    ], false),
    "TowerCondType": [
        "TOWER_COND_CHALLENGE_LEFT_TIME_MORE_THAN",
        "TOWER_COND_LEFT_HP_GREATER_THAN",
    ],
};
