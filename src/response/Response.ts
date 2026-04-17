import { HTTPStatus } from "../common/HTTPStatus.js";

export class Response<Data> {
    protected _headers: Map<string, string|number|string[]>;

    constructor(
        public readonly data?: Data,
        public readonly status: HTTPStatus = HTTPStatus.Success,
    ) {
        this._headers = new Map();
    }

    get headers() {
        return this._headers;
    }

    setHeader(field: string, value: string|number|string[]) {
        this._headers.set(field, value);
        return this;
    }

    toJSON() {
        return {
            ...this.data,
        };
    }
}