import { HTTPException, StatusCode } from "./HTTPException.js";

export class NotFound extends Error implements HTTPException {
    readonly statusCode: StatusCode = StatusCode.NotFound;
}