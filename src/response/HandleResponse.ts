import { Response as ExpressResponse } from "express";
import { Logger } from "@nestjs/common";

import { HTTPException } from "../exceptions/index.js";
import { Response } from "./Response.js";

type Handler<T> = (response: ExpressResponse, ...args: unknown[]) => Promise<Response<T>>;

const logger = new Logger("HandleExceptions");

export function HandleResponse<T>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<Handler<T>>) {
    const originalMethod = descriptor.value as Handler<unknown>;
    const newMethod = async function(response: ExpressResponse, ...args) {
        try {
            const res = await originalMethod.apply(this, [response, ...args]) as Response<T>;
            response.status(res.status.code);
            response.setHeaders(res.headers);
            return res.toJSON();
        } catch (exception: unknown) {
            if (exception instanceof HTTPException) {
                response.status(exception.status.code);
                return {
                    error: exception.message
                }
            }
            logger.error(exception);
            response.status(500);
            return {
                error: exception.toString(),
            };
        }
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = newMethod as any;
    return descriptor;
}