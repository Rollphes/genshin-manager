// To parse this data:
//
//   import { Convert } from "./file";
//
//   const dungeonEntryExcelConfigDataType = Convert.toDungeonEntryExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type DungeonEntryExcelConfigDataType = {
    GAAIKDHGIAI:                boolean;
    condComb:                   CondComb;
    cooldownTipsDungeonId:      number[];
    descriptionCycleRewardList: Array<number[]>;
    descTextMapHash:            number;
    dungeonEntryId:             number;
    id:                         number;
    EMCEEGJKLMK:                number;
    isDefaultOpen:              boolean;
    isShowInAdvHandbook:        boolean;
    GMPKHIHBPAD:                number;
    MBNGDKJLBOP:                number[];
    picPath:                    string;
    rewardDataId:               number;
    satisfiedCond:              SatisfiedCond[];
    sceneId:                    number;
    systemOpenUiId:             number;
    type:                       string;
}

export enum CondComb {
    LogicNone = "LOGIC_NONE",
    LogicOr = "LOGIC_OR",
}

export type SatisfiedCond = {
    param1: number;
    param2: number;
    type:   Type;
}

export enum Type {
    DungeonEntryConditionLevel = "DUNGEON_ENTRY_CONDITION_LEVEL",
    DungeonEntryConditionNone = "DUNGEON_ENTRY_CONDITION_NONE",
    DungeonEntryConditionQuest = "DUNGEON_ENTRY_CONDITION_QUEST",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDungeonEntryExcelConfigDataType(json: string): DungeonEntryExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("DungeonEntryExcelConfigDataType")));
    }

    public static dungeonEntryExcelConfigDataTypeToJson(value: DungeonEntryExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("DungeonEntryExcelConfigDataType"))), null, 2);
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
    "DungeonEntryExcelConfigDataType": o([
        { json: "GAAIKDHGIAI", js: "GAAIKDHGIAI", typ: true },
        { json: "condComb", js: "condComb", typ: r("CondComb") },
        { json: "cooldownTipsDungeonId", js: "cooldownTipsDungeonId", typ: a(0) },
        { json: "descriptionCycleRewardList", js: "descriptionCycleRewardList", typ: a(a(0)) },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "dungeonEntryId", js: "dungeonEntryId", typ: 0 },
        { json: "id", js: "id", typ: 0 },
        { json: "EMCEEGJKLMK", js: "EMCEEGJKLMK", typ: 0 },
        { json: "isDefaultOpen", js: "isDefaultOpen", typ: true },
        { json: "isShowInAdvHandbook", js: "isShowInAdvHandbook", typ: true },
        { json: "GMPKHIHBPAD", js: "GMPKHIHBPAD", typ: 0 },
        { json: "MBNGDKJLBOP", js: "MBNGDKJLBOP", typ: a(0) },
        { json: "picPath", js: "picPath", typ: "" },
        { json: "rewardDataId", js: "rewardDataId", typ: 0 },
        { json: "satisfiedCond", js: "satisfiedCond", typ: a(r("SatisfiedCond")) },
        { json: "sceneId", js: "sceneId", typ: 0 },
        { json: "systemOpenUiId", js: "systemOpenUiId", typ: 0 },
        { json: "type", js: "type", typ: "" },
    ], false),
    "SatisfiedCond": o([
        { json: "param1", js: "param1", typ: 0 },
        { json: "param2", js: "param2", typ: 0 },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "CondComb": [
        "LOGIC_NONE",
        "LOGIC_OR",
    ],
    "Type": [
        "DUNGEON_ENTRY_CONDITION_LEVEL",
        "DUNGEON_ENTRY_CONDITION_NONE",
        "DUNGEON_ENTRY_CONDITION_QUEST",
    ],
};
