import React from "react"
import { Input as AntInput } from "antd"
import "./style.css"

function Input({ item, field, error, Error, ...rest }) {
    if (!item) return;
    const { label, placeholder } = item;
    const { onChange, value, name } = field;
    const { message = "" } = (error && error[name]) || { message: false }
    console.log(rest, "restrestrestinput", error)
    return (
        <>
            <label className='form-label' for={name}>
                {label}
            </label>
            <div className="input-group">
                <AntInput
                    id={name}
                    name={name}
                    className={message && "is-invalid"}
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
            <Error {...{ item, field, error }} />
        </>
    )
}

export default Input;
