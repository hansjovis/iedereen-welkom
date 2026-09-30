import { Module } from "@nestjs/common";

import { InMemoryScopeRepository } from "./repositories/in-memory.scope-repository.js";

@Module({
    providers: [
        {
            provide: "ScopeRepository",
            useClass: InMemoryScopeRepository,
        }
    ],
    exports: [
        "ScopeRepository",
    ]
})
export class ScopeModule {}