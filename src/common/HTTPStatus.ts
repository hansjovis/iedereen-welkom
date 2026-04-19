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
    static readonly InternalServerError = new HTTPStatus(500, "Internal Server Error");

    constructor(
        public readonly code: number, 
        public readonly message: string
    ) {
        if (code < 100 || code > 599) {
            throw new InvalidHTTPStatus(code);
        }
    }

    static byCode(code: number): HTTPStatus {
        switch (code) {
            case 200: return HTTPStatus.Success;
            case 201: return HTTPStatus.Created;
            case 303: return HTTPStatus.SeeOther;
            case 400: return HTTPStatus.BadRequest;
            case 403: return HTTPStatus.Unauthorized;
            case 404: return HTTPStatus.NotFound;
            default: return HTTPStatus.InternalServerError;
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