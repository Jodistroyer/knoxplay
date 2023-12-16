// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

const DemoGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingTop: `${theme.spacing(1)} !important`
  }
}))

const DefaultLabel = props => {
  const { item } = props
  const { label, header } = item
  
return (
    <>
      <Typography variant='h1' sx={{ mb: 2 }}>
        {header}
      </Typography>
      <Typography variant='body2'>{label}</Typography>
    </>
  )
}

export default DefaultLabel
