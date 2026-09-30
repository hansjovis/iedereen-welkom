import { HTTPStatus } from "../common/HTTPStatus.js";
import { HTTPException } from "./HTTPException.js";

export class Unauthorized extends HTTPException {
    constructor(
        message: string = "You are either not logged in or not authorized to view this page.",
    ) {
        super(HTTPStatus.Unauthorized, message);
    }
}