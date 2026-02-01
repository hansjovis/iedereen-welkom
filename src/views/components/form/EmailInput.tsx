import React from "react";

import Input from "./Input";

type Props = {
    label: string,
};

export default function EmailInput(props: Props) {
    return <Input type="email" label={ props.label }/>
}