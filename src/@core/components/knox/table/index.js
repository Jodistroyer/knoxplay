// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

const TableBasic = props => {
  const { item } = props
  const { label, header, options = [], extra } = item
  const { headers = [] } = extra

  console.log(options, '[table]')

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label={label}>
        <TableHead>
          <TableRow>
            {headers.map((el, index) => {
              if (index == 0) {
                return <TableCell key={`hi${index}`}>{el}</TableCell>
              }

              return <TableCell key={`hi${index}`} align='right'>{el}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {options &&
            options?.map(row => (
              <TableRow
                key={`hi3${index}`}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                {headers.map((el, index) => {
                  console.log(el, index, row, '[table]', row[index])
                  if (index == 0) {
                    return (
                      <TableCell
                        key={`hi4${index}`}
                        component='th' scope='row'>
                        {row[index]}
                      </TableCell>
                    )
                  }

                  return <TableCell key={`hi343${index}`} align='right'>{row[index]}</TableCell>
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableBasic
