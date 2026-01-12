import { Response } from "express";
import { ReactElement } from "react";
import { renderToReadableStream } from "react-dom/server";

async function writeToResponse(reader: ReadableStreamDefaultReader, response: Response): Promise<void> {
    let chunk = await reader.read();
    while (chunk.done === false) {
        response.write(chunk.value);
        chunk = await reader.read();
    }
}

export async function render<Props>(
    response: Response, 
    element: ReactElement<Props>,
): Promise<void> {
    try {
        const stream = await renderToReadableStream(element);
        await writeToResponse(stream.getReader(), response);
    } catch (error) {
        console.error(`Error rendering ${element.type}.`, error);
        response.status(500).send(error.message);
    }

    response.status(200).end();
}