import React from "react"

function Error({ item, field, error, ...rest }) {
    if (!item) return;
    const { label, placeholder } = item;
    const { onChange, value, name } = field;
    const { message = "" } = (error && error[name]) || { message: false }
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
