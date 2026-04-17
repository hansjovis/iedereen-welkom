import { HTTPStatus } from "../common/HTTPStatus.js";
import { HTTPException } from "./HTTPException.js";

export class NotFound extends HTTPException {
    constructor(
        message: string,
    ) {
        super(HTTPStatus.NotFound, message);
    }
}