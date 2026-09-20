import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Request, Response } from "express";

import { HTTPException } from "./exceptions/HTTPException.js";
import { HTTPStatus } from "./common/HTTPStatus.js";

@Catch(HTTPException)
export class HTTPExceptionHandler implements ExceptionFilter {
    private readonly logger = new Logger(HTTPExceptionHandler.name);

    catch(exception: HTTPException, host: ArgumentsHost) {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse();

        this.logger.error(`${exception.status}; ${exception}`);

        let redirectTo = request.path;
        if (exception.status.equals(HTTPStatus.Unauthorized)) {
            redirectTo = "/auth/login";
        }

        if (response.headersSent === false) {
            response.setHeader("Refresh", `2.5; url=${redirectTo}`);
        }

        request.flash("error", exception.message);

        response.status(exception.status.code);
        response.render("error", {
            status: exception.status.toJSON(),
            error: exception.message,
            redirectTo,
        });
    }
}