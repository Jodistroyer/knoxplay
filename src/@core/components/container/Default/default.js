import React from "react"

function Default({ item, field, child, ...rest }) {
    if (!item) return;
    const { label, placeholder, name } = item;
    const { onChange, value } = field;

    console.log(rest, "restrestrest")
    return (
        <>
        {label}
            {child}
        </>
    )
}

export default Default;