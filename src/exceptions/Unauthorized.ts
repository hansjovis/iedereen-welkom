import { HTTPException, StatusCode } from "./HTTPException";


export class Unauthorized extends Error implements HTTPException {
    readonly statusCode = StatusCode.Unauthorized;
}