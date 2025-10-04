// To parse this data:
//
//   import { Convert } from "./file";
//
//   const avatarCostumeExcelConfigDataType = Convert.toAvatarCostumeExcelConfigDataType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type AvatarCostumeExcelConfigDataType = {
    animatorConfigPathHash:   number;
    ANJNJBOGPHA:              boolean;
    characterId:              number;
    controllerPathHash:       number;
    controllerRemotePathHash: number;
    descTextMapHash:          number;
    EIONJPMHFFO:              boolean;
    frontIconName:            string;
    hide:                     boolean;
    IGHJECIFPDI:              number;
    imageNameHash:            number;
    indexID:                  number;
    isDefault:                boolean;
    itemId:                   number;
    jsonName:                 string;
    KKNKCFEJKCN:              boolean;
    KNJHBLOKJDG:              number;
    MELAMHFJCMN:              number;
    nameTextMapHash:          number;
    prefabManekinPathHash:    number;
    prefabNpcPathHash:        number;
    prefabPathHash:           number;
    prefabRemotePathHash:     number;
    quality:                  number;
    sideIconName:             string;
    skinId:                   number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAvatarCostumeExcelConfigDataType(json: string): AvatarCostumeExcelConfigDataType[] {
        return cast(JSON.parse(json), a(r("AvatarCostumeExcelConfigDataType")));
    }

    public static avatarCostumeExcelConfigDataTypeToJson(value: AvatarCostumeExcelConfigDataType[]): string {
        return JSON.stringify(uncast(value, a(r("AvatarCostumeExcelConfigDataType"))), null, 2);
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
    "AvatarCostumeExcelConfigDataType": o([
        { json: "animatorConfigPathHash", js: "animatorConfigPathHash", typ: 3.14 },
        { json: "ANJNJBOGPHA", js: "ANJNJBOGPHA", typ: true },
        { json: "characterId", js: "characterId", typ: 0 },
        { json: "controllerPathHash", js: "controllerPathHash", typ: 3.14 },
        { json: "controllerRemotePathHash", js: "controllerRemotePathHash", typ: 3.14 },
        { json: "descTextMapHash", js: "descTextMapHash", typ: 0 },
        { json: "EIONJPMHFFO", js: "EIONJPMHFFO", typ: true },
        { json: "frontIconName", js: "frontIconName", typ: "" },
        { json: "hide", js: "hide", typ: true },
        { json: "IGHJECIFPDI", js: "IGHJECIFPDI", typ: 3.14 },
        { json: "imageNameHash", js: "imageNameHash", typ: 3.14 },
        { json: "indexID", js: "indexID", typ: 0 },
        { json: "isDefault", js: "isDefault", typ: true },
        { json: "itemId", js: "itemId", typ: 0 },
        { json: "jsonName", js: "jsonName", typ: "" },
        { json: "KKNKCFEJKCN", js: "KKNKCFEJKCN", typ: true },
        { json: "KNJHBLOKJDG", js: "KNJHBLOKJDG", typ: 3.14 },
        { json: "MELAMHFJCMN", js: "MELAMHFJCMN", typ: 3.14 },
        { json: "nameTextMapHash", js: "nameTextMapHash", typ: 0 },
        { json: "prefabManekinPathHash", js: "prefabManekinPathHash", typ: 3.14 },
        { json: "prefabNpcPathHash", js: "prefabNpcPathHash", typ: 3.14 },
        { json: "prefabPathHash", js: "prefabPathHash", typ: 3.14 },
        { json: "prefabRemotePathHash", js: "prefabRemotePathHash", typ: 3.14 },
        { json: "quality", js: "quality", typ: 0 },
        { json: "sideIconName", js: "sideIconName", typ: "" },
        { json: "skinId", js: "skinId", typ: 0 },
    ], false),
};
