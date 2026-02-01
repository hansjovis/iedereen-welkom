import React from "react";

import { kebabCase } from "common";

type InputType = "text" | "email" | "number" | "range";

type Props = {
    label: string,
    type: InputType,
    id?: string,
};

export default function Input(props: Props) {
    const label = props.label;
    const type = props.type;
    const id = props.id || kebabCase(label);
    
    return <div className="form-row">
        <label htmlFor={ id }>{ label }</label>
        <input id={ id } name={ id } type={ type } />
    </div>
}