import { HTTPStatus } from "../common/HTTPStatus.js";
import { HTTPException } from "./HTTPException.js";

export class Unauthorized extends HTTPException {
    constructor(
        message: string,
    ) {
        super(HTTPStatus.Unauthorized, message);
    }
}