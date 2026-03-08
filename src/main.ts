import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./modules/app.module.js";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.listen(process.env.PORT ?? 3000);
}

bootstrap();