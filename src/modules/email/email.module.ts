import { Module } from "@nestjs/common";
import { NoopEmailService } from "./noop.email-service.js";

@Module({
    providers: [
        NoopEmailService,
    ],
    exports: [
        NoopEmailService,
    ]
})
export class EmailModule {}