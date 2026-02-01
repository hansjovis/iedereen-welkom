import React from "react";
import Input from "./Input";

type Props = {
    label: string,
}

export default function TextInput(props: Props) {
    return <Input type="text" label={ props.label } />
}