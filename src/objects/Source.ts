type MediaType = "text/markdown" | "text/html" | "text";

export class Source {
    constructor(
        public readonly content: string,
        public readonly mediaType: MediaType 
    ) {}
}