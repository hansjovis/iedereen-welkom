import { HTTPStatus } from "../common/HTTPStatus.js"
import { HTTPException } from "./HTTPException.js";

export class InvalidValue extends HTTPException {
    constructor(
        message: string,
    ) {
        super(HTTPStatus.BadRequest, message);
    }
}