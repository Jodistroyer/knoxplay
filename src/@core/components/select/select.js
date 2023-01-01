import React from "react"
import { Select as AntSelect } from "antd"
import Select from "react-select";

function AntCustomSelect({ item, field, managedCallback, ...rest }) {
    if (!item) return;
    const { label, placeholder, name, options, defaultValue } = item;
    if (!options) return;
    const { onChange, value } = field;
    return (
        <>
            <label className='form-label' for={name}>
                {label}
            </label>
            <div className="input-group">
                <AntSelect
                    defaultValue={defaultValue}
                    style={{ width: '100%' }}
                    onChange={onChange}
                    options={options}
                    fieldNames="data.id"
                />
            </div>
        </>
    );
};

function CustomSelect({ item, field, managedCallback,error, Error, ...rest }) {
    if (!item) return;
    const { label, placeholder, name, options, defaultValue } = item;
    if (!options) return;
    const { onChange, value } = field;
    const isMulti = false;
    const CustomOnChange = (element) => {
        console.log(element, 'CustomOnChange')
        onChange(element.value);
    }

    const getValue = () => {
        if (options) {
            return isMulti
                ? options.filter(option => value.indexOf(option.value) >= 0)
                : options.find(option => option.value === value);
        } else {
            return isMulti ? [] : "";
        }
    };


    return (
        <>
            <label className='form-label' for={name}>
                {label}
            </label>
            <div className="input-group">
                <Select
                    // defaultValue={defaultValue}
                    style={{ width: '100%' }}
                    {...field}
                    value={getValue()}
                    onChange={CustomOnChange}
                    options={options}
                // fieldNames="data.id"
                />
            </div>
            <Error {...{ item, field, error }} />
        </>
    );
};



export default CustomSelect;
