import { HTTPException, StatusCode } from "./HTTPException";

export class NotFound extends Error implements HTTPException {
    readonly statusCode: StatusCode = StatusCode.NotFound;
}