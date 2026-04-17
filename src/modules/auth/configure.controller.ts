import { Controller, Get } from "@nestjs/common";

@Controller("/auth/configure")
export class ConfigureController {
    @Get("/")
    configure() {

    }
}