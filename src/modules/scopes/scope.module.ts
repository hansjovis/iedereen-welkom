import { Module } from "@nestjs/common";

import { InMemoryScopeRepository } from "./repositories/in-memory.scope-repository.js";
import { InMemoryClaimRepository } from "./repositories/in-memory.claim-repository.js";

@Module({
    providers: [
        {
            provide: "ScopeRepository",
            useClass: InMemoryScopeRepository,
        },
        {
            provide: "ClaimRepository",
            useClass: InMemoryClaimRepository,
        }
    ],
    exports: [
        "ScopeRepository",
        "ClaimRepository",
    ]
})
export class ScopeModule {}