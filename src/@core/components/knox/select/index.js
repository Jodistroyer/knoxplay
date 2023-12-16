// ** MUI Import
import MenuItem from '@mui/material/MenuItem'

// import Select from '@mui/material/Select'
import { Select, Space } from 'antd'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/knox/text-field'

const SelectCustom = props => {
  const { item, field, name, error } = props
  const { label, options } = item
  const { value, onChange } = field
  const myError = (error && error[name] && error[name].message) || false

  console.log(options, '[options]', value)
  
return (
    <>
      {label}
      <br />
      <Select
        defaultValue={value}
        style={{
          width: '100%'
        }}
        onChange={onChange}
        options={options}
      />
      {myError}
    </>
  )
}

export { SelectCustom }
