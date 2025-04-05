import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaTrash, FaFilter } from 'react-icons/fa6'
import { visuallyHidden } from '@mui/utils'

function createData(id, name, dni, birthDate, lastConsultation, diagnosis) {
  return {
    id,
    name,
    dni,
    birthDate,
    lastConsultation,
    diagnosis,
  }
}

const rows = [
  createData(
    1,
    'John Doe',
    '12345678',
    '1985-06-15',
    '2025-03-10',
    'Hypertension'
  ),
  createData(
    2,
    'Jane Smith',
    '87654321',
    '1990-11-20',
    '2025-04-01',
    'Diabetes'
  ),
  createData(
    3,
    'Michael Brown',
    '11223344',
    '1978-02-03',
    '2025-02-20',
    'Asthma'
  ),
  createData(
    4,
    'Emily Davis',
    '55667788',
    '2000-07-30',
    '2025-03-25',
    'Migraine'
  ),
  createData(
    5,
    'William Johnson',
    '99887766',
    '1995-12-18',
    '2025-04-03',
    'Back Pain'
  ),
  createData(
    6,
    'Emma Wilson',
    '22334455',
    '1988-04-23',
    '2025-03-15',
    'Anxiety'
  ),
  createData(
    7,
    'Oliver Garcia',
    '33445566',
    '1975-09-12',
    '2025-02-28',
    'Arthritis'
  ),
  createData(
    8,
    'Sophia Martinez',
    '44556677',
    '1992-01-05',
    '2025-03-22',
    'Insomnia'
  ),
  createData(
    9,
    'Liam Robinson',
    '55667799',
    '1983-06-10',
    '2025-03-18',
    'Hypertension'
  ),
  createData(
    10,
    'Isabella Thompson',
    '66778800',
    '2001-11-25',
    '2025-04-01',
    'Thyroid Issues'
  ),
  createData(
    11,
    'James Clark',
    '77889911',
    '1969-07-14',
    '2025-03-29',
    'Heart Disease'
  ),
  createData(
    12,
    'Charlotte Lewis',
    '88990022',
    '1986-02-07',
    '2025-03-24',
    'Chronic Pain'
  ),
  createData(
    13,
    'Benjamin Walker',
    '99001133',
    '1970-12-22',
    '2025-02-14',
    'Obesity'
  ),
  createData(
    14,
    'Amelia Hall',
    '10111223',
    '1999-03-03',
    '2025-04-02',
    'Migraines'
  ),
  createData(
    15,
    'Lucas Allen',
    '11121334',
    '1982-10-18',
    '2025-03-27',
    'Depression'
  ),
  createData(16, 'Mia Young', '12131445', '1993-08-09', '2025-03-21', 'Asthma'),
  createData(
    17,
    'Elijah King',
    '13141556',
    '1987-01-30',
    '2025-02-19',
    'Diabetes'
  ),
  createData(
    18,
    'Ava Wright',
    '14151667',
    '1996-05-25',
    '2025-04-01',
    'Stress Disorder'
  ),
  createData(
    19,
    'Noah Scott',
    '15161778',
    '2004-07-17',
    '2025-03-20',
    'Allergies'
  ),
  createData(
    20,
    'Harper Adams',
    '16171889',
    '1984-11-02',
    '2025-03-31',
    'Hypertension'
  ),
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Patient Name',
  },
  {
    id: 'dni',
    numeric: true,
    disablePadding: false,
    label: 'DNI',
  },
  {
    id: 'birthDate',
    numeric: true,
    disablePadding: false,
    label: 'Birth Date',
  },
  {
    id: 'lastConsultation',
    numeric: true,
    disablePadding: false,
    label: 'Last Consultation',
  },
  {
    id: 'diagnosis',
    numeric: true,
    disablePadding: false,
    label: 'Diagnosis',
  },
]

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

function EnhancedTableToolbar(props) {
  const { numSelected } = props
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Patient Information
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <FaTrash />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FaFilter />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align='right'>{row.dni}</TableCell>
                    <TableCell align='right'>{row.birthDate}</TableCell>
                    <TableCell align='right'>{row.lastConsultation}</TableCell>
                    <TableCell align='right'>{row.diagnosis}</TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
