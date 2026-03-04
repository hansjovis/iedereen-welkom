export class InvalidStatusCode extends Error {
    constructor(code: number) {
        super(`"${code}" is an invalid status code.`);
    }
}

export class StatusCode {
    static readonly Unauthorized = new StatusCode(403, "Unauthorized");
    static readonly NotFound = new StatusCode(404, "Not Found");
    static readonly BadRequest = new StatusCode(400, "Bad Request");

    constructor(
        public readonly code: number, 
        public readonly message: string
    ) {
        if (code < 100 || code > 599) {
            throw new InvalidStatusCode(code);
        }
    }
}

export interface HTTPException {
    readonly statusCode: StatusCode,
}