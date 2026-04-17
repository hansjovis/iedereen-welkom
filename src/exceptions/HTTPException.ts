import { HTTPStatus } from "../common/HTTPStatus.js";

export abstract class HTTPException extends Error{
    constructor(
        public readonly status: HTTPStatus,
        public readonly message: string,
    ) {
        super(message);
    }
}