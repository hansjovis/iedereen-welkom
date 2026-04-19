import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

import { HTTPException } from "./exceptions/HTTPException.js";
import { HTTPStatus } from "./common/HTTPStatus.js";

@Catch(HTTPException)
export class HTTPExceptionHandler implements ExceptionFilter {
    private readonly logger = new Logger(HTTPExceptionHandler.name);

    catch(exception: HTTPException, host: ArgumentsHost) {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse();

        this.logger.error(exception.toString());

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

@Catch(Error)
export class ErrorHandler implements ExceptionFilter {
    private readonly logger = new Logger(HTTPExceptionHandler.name);

    private getRedirect(request: Request, exception: Error) {
        if (exception instanceof HttpException && exception.getStatus() === HTTPStatus.NotFound.code) {
            return "/auth/login";
        }
        return request.path;
    }

    catch(exception: Error, host: ArgumentsHost) {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse();

        this.logger.error(exception.toString());

        let status = 500;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
        }

        const redirectTo = this.getRedirect(request, exception);
        if (response.headersSent === false) {
            response.setHeader("Refresh", `2.5; url=${redirectTo}`);
        }

        request.flash("error", exception.message);

        response.status(status);
        response.render("error", {
            status: HTTPStatus.byCode(status).toJSON(),
            error: exception.message,
            redirectTo,
        });
    }
}