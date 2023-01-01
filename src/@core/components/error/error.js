import React from "react"
import { get } from "lodash"

function Error({ item, field, error, ...rest }) {
    if (!item) return;
    const { label, placeholder } = item;
    const { onChange, value, name } = field;
    const { message = "" } = (error && get(error, name)) || { message: false }
    console.log(rest, "errororororor", error)
    if(message === "") return null;

    return (
        <div
            class="invalid-feedback"
            style={{ display: 'block' }}>
            {message}
        </div>
    )
}

export default Error;
