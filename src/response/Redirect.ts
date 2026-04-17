import { HTTPStatus } from "../common/HTTPStatus.js"
import { Response } from "./Response.js"

export class RedirectResponse extends Response<string> {
    constructor(
        message: string,
        redirectTo: string,
    ) {
        super(
            message,
            HTTPStatus.SeeOther,
        );
        this.setHeader("Location", redirectTo);
    }
}