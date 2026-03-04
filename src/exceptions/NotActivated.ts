import { HTTPException, StatusCode } from "./HTTPException";

export class NotActivated extends Error implements HTTPException {
    statusCode = StatusCode.Unauthorized;
}