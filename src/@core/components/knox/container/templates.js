import React from 'react'
import DefaultContainer from './default'
import GridContainer from './grid'
import MainContainer from './main'

const TemplateList = {
  '': props => <DefaultContainer {...props} />,
  grid: props => <GridContainer {...props} />,
  main: props => <MainContainer {...props} />
}

export default TemplateList
