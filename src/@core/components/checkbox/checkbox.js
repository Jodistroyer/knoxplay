import React from "react"
import { Checkbox as AntCheckbox } from "antd"
import "./style.css"

function Checkbox({ item, field, error, Error, ...rest }) {

  if (!item) return;
  const { label, placeholder } = item;
  const { onChange, value } = field;

  return (
    <>
      <AntCheckbox
        value={value}
        onChange={onChange}
      >
        {label}
      </AntCheckbox>
      <Error {...{ item, field, error }} />
    </>
  );
};

export default Checkbox;