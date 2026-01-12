import React, { ReactNode } from "react";

type Props = {
    title: string,
    description: string,
    children?: ReactNode[],
}

export default function MainLayout({
    title, 
    description, 
    children = []
}: Props) {
    return <html>
        <head>
            <title>{ title }</title>
            <meta name="description" content={ description }/>
        </head>
        <body>
            <h1>Hello World!</h1>
            { ...children }
        </body>
    </html>
    ;
}