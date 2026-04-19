import { UUID } from "modules/user/index.js";

export class App {
    constructor(
        public readonly id: UUID,
        public name: string,
        public description: string,
    ) {}
}