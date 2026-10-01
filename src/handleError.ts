import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Response } from "express";

import { HTTPException } from "./exceptions/HTTPException.js";

@Catch(HTTPException)
export class HTTPExceptionHandler implements ExceptionFilter {
    private readonly logger = new Logger(HTTPExceptionHandler.name);

    catch(exception: HTTPException, host: ArgumentsHost) {
        // const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse();

        this.logger.error(`${exception.status}; ${exception}`);

        response.status(exception.status.code);
        response.render("error", {
            status: exception.status.toJSON(),
            error: exception.message,
        });
    }
}