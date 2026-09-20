export class InvalidHTTPStatus extends Error {
    constructor(code: number) {
        super(`"${code}" is an invalid status code.`);
    }
}

export class HTTPStatus {
    static readonly Success = new HTTPStatus(200, "Success");
    static readonly Created = new HTTPStatus(201, "Created");
    static readonly SeeOther = new HTTPStatus(303, "See Other");
    static readonly BadRequest = new HTTPStatus(400, "Bad Request");
    static readonly Unauthorized = new HTTPStatus(403, "Unauthorized");
    static readonly NotFound = new HTTPStatus(404, "Not Found");
    static readonly InternalServerError = new HTTPStatus(500, "Internal Server Error");

    static readonly map: Record<number, HTTPStatus> = {
        200: HTTPStatus.Success,
        201: HTTPStatus.Created,
        303: HTTPStatus.SeeOther,
        400: HTTPStatus.BadRequest,
        403: HTTPStatus.Unauthorized,
        404: HTTPStatus.NotFound,
        500: HTTPStatus.InternalServerError,
    }

    constructor(
        public readonly code: number, 
        public readonly message: string
    ) {
        if (code < 100 || code > 599) {
            throw new InvalidHTTPStatus(code);
        }
    }

    static byCode(code: number): HTTPStatus {
        if (code in this.map) {
            return this.map[code];
        }
        return HTTPStatus.Unauthorized;
    }

    equals(other: HTTPStatus): boolean {
        return other.code === this.code;
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }

    toString() {
        return `${this.code} (${this.message})`;
    }
}