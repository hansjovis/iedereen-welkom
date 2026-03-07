import { HTTPException, StatusCode } from "./HTTPException.js";


export class Unauthorized extends Error implements HTTPException {
    readonly statusCode = StatusCode.Unauthorized;
}