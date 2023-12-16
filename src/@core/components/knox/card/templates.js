import React from 'react'
import EcommerceCongratulationsJohn from './default'
import GridCard from './grid'

const TemplateList = {
  '': props => <EcommerceCongratulationsJohn {...props} />,
  grid: props => <GridCard {...props} />
}

export default TemplateList
