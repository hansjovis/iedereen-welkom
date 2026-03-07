import { HTTPException, StatusCode } from "./HTTPException.js";

export class NotActivated extends Error implements HTTPException {
    statusCode = StatusCode.Unauthorized;
}