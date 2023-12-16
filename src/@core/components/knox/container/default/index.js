// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const DefaultContainer = props => {
  const { child, item } = props
  const { label } = item
  
return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title={label} />
        <CardContent>
          <Grid container spacing={5}>
            {child}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default DefaultContainer
