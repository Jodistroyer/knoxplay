// ** MUI Imports
import Grid from '@mui/material/Grid'

const GridContainer = props => {
  const { child } = props
  
return (
    <Grid item xs={12}>
      {child}
    </Grid>
  )
}

export default GridContainer
