import { join } from "node:path";
import { loadEnvFile } from "node:process";

import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

import { static as expressStatic } from "express";
import session from "express-session";
import flash from "connect-flash";

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
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.error = req.flash("error");
        next();
    });
    app.useGlobalFilters(
        new ErrorHandler(),
        new HTTPExceptionHandler(),
    );

    app.listen(process.env.PORT ?? 3000);
}

bootstrap();