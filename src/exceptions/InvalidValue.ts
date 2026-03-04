import { HTTPException, StatusCode } from "./HTTPException";

export class InvalidValue extends Error implements HTTPException {
    statusCode = StatusCode.BadRequest;
}