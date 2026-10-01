import { join } from "node:path";
import { loadEnvFile } from "node:process";

import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { static as expressStatic, NextFunction, Request, Response } from "express";
import session from "express-session";
import flash from "connect-flash";
import hbs from "hbs";

import { AppModule } from "./modules/app.module.js";
import { HTTPExceptionHandler } from "./handleError.js";
import { BadRequest } from "./exceptions/BadRequest.js";

function setupViewEngine(app: NestExpressApplication) {
    app.setBaseViewsDir(join("views"));
    app.setViewEngine("hbs");

    function concatHelper(...strings: string[]) {
        // Strip off the last argument, since it is a context object.
        return strings.slice(0, -1).join("");
    }

    hbs.registerHelper("concat", concatHelper);
    hbs.registerPartials("views/partials");

    app.set("view options", { 
        layout: "/layouts/main",
    });
}

async function bootstrap() {
    loadEnvFile();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(expressStatic("public"));

    setupViewEngine(app);

    app.useGlobalPipes(new ValidationPipe({ 
        transform: true,
        exceptionFactory(errors) {
            console.error(errors[0]);
            const messages = errors.flatMap(error => Object.values(error.constraints));
            throw new BadRequest(messages.join(", "));
        },
    }));
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
    app.use((_: Request, res: Response, next: NextFunction) => {
        res.locals.app = {
            name: "Auth",
            styles: [
                "reset",
                "main",
                "common",
                "card",
                "form",
                "dismissable",
                "layout",
                "toggle",
            ],
            scripts: [
                { id: "dismissable" }
            ]
        }
        next();
    });
    app.useGlobalFilters(
        new HTTPExceptionHandler(),
    );

    app.listen(process.env.PORT ?? 3000);
}

bootstrap();