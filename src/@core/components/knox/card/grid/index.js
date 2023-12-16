// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

const data = [
  {
    stats: '230k',
    title: 'Sales',
    color: 'primary',
    icon: 'tabler:chart-pie-2'
  },
  {
    color: 'info',
    stats: '8.549k',
    title: 'Customers',
    icon: 'tabler:users'
  },
  {
    color: 'error',
    stats: '1.423k',
    title: 'Products',
    icon: 'tabler:shopping-cart'
  },
  {
    stats: '$9745',
    color: 'success',
    title: 'Revenue',
    icon: 'tabler:currency-dollar'
  }
]

const renderStats = options => {
  return (
    options &&
    options.map((sale, index) => (
      <Grid item xs={6} md={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color={sale[0]} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={sale[1]} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{sale[2]}</Typography>
            <Typography variant='body2'>{sale[3]}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  )
}

const GridCard = props => {
  const { item } = props
  const { label, header, options = [], extra } = item

  console.log(options, '[GridCard]')

  return renderStats(options)
}

export default GridCard
