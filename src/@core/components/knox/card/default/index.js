// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110
  }
}))

const EcommerceCongratulationsJohn = props => {
  const { item } = props
  const { label, header, title, description, value } = item

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5' sx={{ mb: 0.5 }}>
          {header} 🎉
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>{label}</Typography>
        <Typography variant='h4' sx={{ mb: 0.75, color: 'primary.main' }}>
          {value}
        </Typography>
        {/* <Button variant='contained'>{description}</Button> */}
        <Illustration width={116} alt='congratulations john' src='/images/cards/congratulations-john.png' />
      </CardContent>
    </Card>
  )
}

export default EcommerceCongratulationsJohn
