import React, { ReactNode } from "react";

type Props = {
    title: string,
    description: string,
    children: ReactNode[],
}

export default function MainLayout(props: Props) {
    return <html>
        <head>
            <title>{ props.title }</title>
            <meta name="description" content={ props.description }/>
        </head>
        <body>
            { ...props.children }
        </body>
    </html>
    ;
}