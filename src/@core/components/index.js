import React from 'react'

// Components Cleanup
// import { Button } from "./Dynamo/Button";
import CustomTextField from 'src/@core/components/knox/text-field'
import { Fieldset } from 'src/@core/components/knox/container'
import { DefaultButton } from 'src/@core/components/knox/button'
import { SelectCustom } from 'src/@core/components/knox/select'
import DefaultLabel from 'src/@core/components/knox/label'
import { Card } from 'src/@core/components/knox/card'
import TableBasic from 'src/@core/components/knox/table'
import DefaultHook from 'src/@core/components/knox/hook'

const Components = {
  button: props => <DefaultButton {...props} />,
  label: props => <DefaultLabel {...props} />,
  card: props => <Card {...props} />,
  fieldset: props => <Fieldset {...props} />,
  table: props => <TableBasic {...props} />,

  // radiobox: (props) => <Radiobox {...props} />,
  select: props => <SelectCustom fullWidth select {...props} />,
  text: props => <CustomTextField fullWidth {...props} />,
  hook: props => <DefaultHook {...props} />

  // header: (props) => <Header {...props} />,
  // tab: (props) => <Tab {...props} />,
  // modal: (props) => <Modal {...props} />,
  // card: (props) => <Card {...props} />,
  // box: (props) => <Box {...props} />,
  // list: (props) => <List {...props} />,
  // result: (props) => <Result {...props} />,
  // wallet: (props) => <Wallet {...props} />,
  // toast: (props) => <Toast {...props} />,
  // image: (props) => <Image {...props} />,
  // badge: (props) => <Badge {...props} />,
  // pincode: (props) => <Pincode {...props} />,
  // videoCamera: (props) => <VideoCamera {...props} />,
  // divider: (props) => <Divider {...props} />,
  // switch: (props) => <Switch {...props} />,
  // calendar: (props) => <Calendar {...props} />,
  // popup: (props) => <Popup {...props} />,
  // timePicker: (props) => <TimePicker {...props} />,
}

export const renderComponent = (type, propsItems) => {
  // find the respective type from dictionary

  const SelectedComponent = Components && Components[type]

  // to ensure it is not undefined
  // prevent rendering error
  if (SelectedComponent === undefined) return null

  delete propsItems.item.theme

  // return component with container together
  return SelectedComponent({ ...propsItems })

  //return renderContainer(selectedComponent({ ...propsItems }))
}

// const renderContainer = (children) => <View style={{ flex: 1 }}>{children}</View>;

export const validationResolver = {
  noteq: async (item, value) => {
    return !(value === item.value)

    // return (value !== "" && !item.value.includes(value)) || false;
  },
  eq: async (item, value) => {
    return value === item.value
  },
  exist: async (item, value) => {
    return value !== ''
  },
  eq1: async (item, value) => {
    return (value !== '' && item.value.includes(value)) || false
  }
}
