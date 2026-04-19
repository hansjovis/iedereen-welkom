import { join } from "node:path";
import { loadEnvFile } from "node:process";

import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

import session from "express-session";
import { static as expressStatic, NextFunction, Request, Response } from "express";

import { AppModule } from "./modules/app.module.js";
import { ErrorHandler, HTTPExceptionHandler } from "./handleError.js";

async function bootstrap() {
    loadEnvFile();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setBaseViewsDir(join("views"));
    app.use(expressStatic("public"));
    app.setViewEngine("hbs");
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
    app.use((req: Request, res: Response, next: NextFunction) => {
        next();
    });
    app.useGlobalFilters(
        new ErrorHandler(),
        new HTTPExceptionHandler(),
    );

    app.listen(process.env.PORT ?? 3000);
}

bootstrap();