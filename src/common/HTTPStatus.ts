export class InvalidHTTPStatus extends Error {
    constructor(code: number) {
        super(`"${code}" is an invalid status code.`);
    }
}

export class HTTPStatus {
    static readonly Success = new HTTPStatus(200, "Success");
    static readonly Created = new HTTPStatus(201, "Created");

    static readonly Unauthorized = new HTTPStatus(403, "Unauthorized");
    static readonly NotFound = new HTTPStatus(404, "Not Found");
    static readonly BadRequest = new HTTPStatus(400, "Bad Request");
    static readonly SeeOther = new HTTPStatus(303, "See Other");

    constructor(
        public readonly code: number, 
        public readonly message: string
    ) {
        if (code < 100 || code > 599) {
            throw new InvalidHTTPStatus(code);
        }
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
}