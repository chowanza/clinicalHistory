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
import Button from '@mui/material/Button'
import { FaTrash, FaFilter, FaArrowRight } from 'react-icons/fa6'
import { visuallyHidden } from '@mui/utils'
import { usePatients } from '../../context/PatientsContext'
import { useNavigate } from 'react-router-dom'

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

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
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
    <TableHead className='dark:bg-gray-800'>
      <TableRow className='dark:border-gray-700'>
        <TableCell
          padding='checkbox'
          className='dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
        >
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            className='dark:text-blue-400'
            sx={{
              color: 'inherit',
              '&.Mui-checked': {
                color: 'inherit',
              },
              '&.MuiCheckbox-indeterminate': {
                color: 'inherit',
              },
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className='dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              className='dark:text-gray-300'
              sx={{
                '&.MuiTableSortLabel-root': {
                  color: 'inherit',
                },
                '&.MuiTableSortLabel-root:hover': {
                  color: 'inherit',
                },
                '&.MuiTableSortLabel-root.Mui-active': {
                  color: 'inherit',
                },
                '& .MuiTableSortLabel-icon': {
                  color: 'inherit !important',
                },
              }}
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
  const { numSelected, onDelete, isDeleting } = props

  const toolbarStyles = React.useMemo(() => {
    const baseStyles = {
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
    }

    if (numSelected > 0) {
      return [
        baseStyles,
        {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
          '&.dark-mode': {
            background: `linear-gradient(
              to right,
              oklch(0.41 0.2072 300),
              oklch(0.58 0.185 261)
            )`,
          },
        },
      ]
    }

    return [baseStyles]
  }, [numSelected])

  return (
    <Toolbar
      className={`dark:bg-gray-700 ${numSelected > 0 ? 'dark-mode' : ''}`}
      sx={toolbarStyles}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='subtitle1'
          component='div'
          className='text-gray-200'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
          className='dark:text-gray-200'
        >
          Patient Information
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton
            onClick={onDelete}
            disabled={isDeleting}
            className='dark:text-gray-300 dark:hover:text-red-400'
          >
            {isDeleting && <span className='ml-2'>Eliminando...</span>}
            <FaTrash className='text-gray-300 hover:text-red-400' />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton className='dark:text-gray-300 dark:hover:text-secondary'>
            <FaFilter className='dark:text-gray-300 dark:hover:text-secondary' />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  onDelete: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
}

export default function EnhancedTable({ filter }) {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState([])
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState(null)
  const { getPatients, patients, deletePatient } = usePatients()
  const [selected, setSelected] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      await getPatients()
    }

    fetchData()
  }, [])

  React.useEffect(() => {
    if (patients.length === 0) return

    const formattedRows = patients.map((patient) => {
      return createData(
        patient._id,
        `${patient.firstNames} ${patient.lastNames}`,
        patient.phone || 'N/A',
        patient.birthDate
          ? new Date(patient.birthDate).toLocaleDateString()
          : 'N/A',
        patient.date ? formatDate(patient.date) : 'N/A',
        patient.diagnostic || 'No diagnosis'
      )
    })

    setRows(formattedRows)
  }, [patients])

  const handleDelete = async () => {
    if (selected.length === 0 || isDeleting) return

    setIsDeleting(true)
    setError(null)

    try {
      // Eliminación en lote (recomendado para +5 registros)
      const BATCH_SIZE = 5
      for (let i = 0; i < selected.length; i += BATCH_SIZE) {
        const batch = selected.slice(i, i + BATCH_SIZE)
        await Promise.all(batch.map((id) => deletePatient(id)))
      }
      setRows((prevRows) =>
        prevRows.filter((row) => !selected.includes(row.id))
      )

      // Sincronización con el servidor
      await getPatients()

      // Limpiar selección
      setSelected([])
    } catch (err) {
      setError(
        `Error al eliminar ${selected.length} paciente(s). Intenta nuevamente.`
      )
      console.error('Error en handleDelete:', err)
    } finally {
      setIsDeleting(false)
    }
  }

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

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  )

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, order, orderBy, page, rowsPerPage]
  )

  const navigate = useNavigate()

  return (
    <Box sx={{ width: '100%' }} className='dark:bg-gray-900 dark:text-gray-300'>
      {error && (
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4'>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className='text-red-500 underline'
          >
            Cerrar
          </button>
        </div>
      )}
      <Paper
        sx={{ width: '100%', mb: 2 }}
        className='dark:bg-gray-800 dark:text-gray-200 dark:shadow-md'
      >
        <EnhancedTableToolbar
          onDelete={handleDelete}
          numSelected={selected.length}
          isDeleting={isDeleting}
        />
        <TableContainer className='dark:bg-gray-800 dark:text-gray-300'>
          <Table
            sx={{
              minWidth: 750,
              '.MuiTableCell-root': {
                color: 'inherit',
              },
              '.MuiTableRow-root': {
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              },
            }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className='dark:bg-gray-800 dark:text-gray-300'>
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
                    className={`dark:hover:bg-gray-700 dark:border-gray-700 ${
                      isItemSelected
                        ? 'dark:bg-gray-700 dark:text-gray-200'
                        : 'dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <TableCell
                      padding='checkbox'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        className='dark:text-blue-400'
                        sx={{
                          color: 'inherit',
                          '&.Mui-checked': {
                            color: 'inherit',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align='right'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      {row.dni}
                    </TableCell>
                    <TableCell
                      align='right'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      {row.birthDate}
                    </TableCell>
                    <TableCell
                      align='right'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      {row.lastConsultation}
                    </TableCell>
                    <TableCell
                      align='right'
                      className='dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
                    >
                      {row.diagnosis}
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title='Abrir ficha'>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/dashboard-doctor/patients/${row.id}`)
                          }}
                          size='small'
                          variant='outlined'
                          className='flex justify-center items-center dark:border-primary dark:text-primary'
                          endIcon={<FaArrowRight size={14} className='' />}
                        >
                          Ver
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                  className='dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                >
                  <TableCell
                    colSpan={6}
                    className='dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
          sx={{
            '.MuiTablePagination-toolbar': {
              color: 'white',
              backgroundColor: 'oklch(0.41 0.2072 300)',
            },
            '.MuiTablePagination-selectLabel': {
              color: 'inherit',
            },
            '.MuiTablePagination-displayedRows': {
              color: 'inherit',
            },
            '.MuiTablePagination-select': {
              color: 'inherit',
            },
            '.MuiTablePagination-selectIcon': {
              color: 'inherit',
            },
            '.MuiTablePagination-actions': {
              color: 'inherit',
            },
          }}
        />
      </Paper>
    </Box>
  )
}
