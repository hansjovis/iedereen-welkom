import { HTTPException, StatusCode } from "./HTTPException.js";

export class InvalidValue extends Error implements HTTPException {
    statusCode = StatusCode.BadRequest;
}