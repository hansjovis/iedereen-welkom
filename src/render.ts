import { Response } from "express";
import React, { FunctionComponent } from "react";
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
    Component: FunctionComponent<Props>, 
    props: Props
): Promise<void> {
    try {
        const component = React.createElement(Component, props)
        const stream = await renderToReadableStream(component);
        await writeToResponse(stream.getReader(), response);
    } catch (error) {
        console.error(`Error rendering ${Component.name}.`, error);
        response.status(500).send(error.message);
    }

    response.status(200).end();
}