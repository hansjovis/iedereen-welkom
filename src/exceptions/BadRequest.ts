import { HTTPStatus } from "../common/HTTPStatus.js";
import { HTTPException } from "./HTTPException.js";

export class BadRequest extends HTTPException {
    constructor(message: string) {
        super(HTTPStatus.BadRequest, message);
    }
}