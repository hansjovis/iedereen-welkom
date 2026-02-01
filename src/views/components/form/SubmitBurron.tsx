import React, { ReactNode } from "react";

type Props = {
    children: ReactNode | ReactNode[]
}

export default function SubmitButton(props: Props) {
    return <button type="submit">{ props.children }</button>
}