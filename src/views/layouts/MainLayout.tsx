import React, { ReactNode } from "react";

type Props = {
    title: string,
    description: string,
    children?: ReactNode | ReactNode[],
}

export default function MainLayout(props: Props) {
    const { title, description, children = [] } = props;

    return <html>
        <head>
            <title>{ title }</title>
            <meta name="description" content={ description }/>
        </head>
        <body>
            { children }
        </body>
    </html>
    ;
}