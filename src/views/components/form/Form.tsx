import React, { ReactNode } from "react";

type Props = {
    className: string,
    children: ReactNode | ReactNode[],
    endpoint: string
};

export default function Form(props: Props) {
    const { className, endpoint, children } = props;
    return <form className={ className } action={ endpoint }>
        { children }
    </form>
}