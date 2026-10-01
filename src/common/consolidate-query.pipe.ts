import { Injectable, PipeTransform } from "@nestjs/common";

type JSONObject = Record<string, unknown>;

// Source - https://stackoverflow.com/a/65072147
// Posted by Luan Nguyen
// Retrieved 2026-10-01, License - CC BY-SA 4.0

function set(obj = {}, paths = [], value: unknown) {
    const inputObj = Object.assign({}, obj);

    if (paths.length === 0) {
        return inputObj;
    }

    if (paths.length === 1) {
        const path = paths[0];
        inputObj[path] = value;
        return { ...inputObj, [path]: value };
    }

    const [path, ...rest] = paths;
    const currentNode = inputObj[path];

    const childNode = set(currentNode, rest, value);

    return { ...inputObj, [path]: childNode };
};

/**
 * Transforms objects in the form of
 * ```js
 * {
 *      bla: 3,
 *      "foo.bar": 1,
 *      "foo.baz": 2,
 * }
 * ```
 * to objects in the form of
 * ```js
 * {
 *      bla: 3,
 *      foo: {
 *          bar: 1,
 *          baz: 2,
 *      },
 * }
 * ```
 */
@Injectable()
export class ConsolidateObjectPipe implements PipeTransform<JSONObject, JSONObject> {
    transform(value: JSONObject): JSONObject {
        let out: JSONObject = {};
        for(const [key, val] of Object.entries(value)) {
            out = set(out, key.split("."), val);
        }
        return out;
    }
}