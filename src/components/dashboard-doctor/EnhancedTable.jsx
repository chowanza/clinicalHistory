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
  const [year, month, day] = isoString.split('T')[0].split('-')
  return `${day}/${month}/${year}`
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
    label: 'Nombre Paciente',
  },
  {
    id: 'dni',
    numeric: true,
    disablePadding: false,
    label: 'Teléfono',
  },
  {
    id: 'birthDate',
    numeric: true,
    disablePadding: false,
    label: 'Fecha Nacimiento',
  },
  {
    id: 'lastConsultation',
    numeric: true,
    disablePadding: false,
    label: 'Ultima Consulta',
  },
  {
    id: 'diagnosis',
    numeric: true,
    disablePadding: false,
    label: 'Diagnostico',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Acciones',
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
    <TableHead className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
      <TableRow className='border-b-2 border-gray-200 dark:border-gray-600'>
        <TableCell
          padding='checkbox'
          className='bg-transparent border-0'
          sx={{
            backgroundColor: 'transparent !important',
            borderBottom: '2px solid rgb(229 231 235)',
            '.dark &': {
              borderBottom: '2px solid rgb(75 85 99)',
            },
          }}
        >
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            sx={{
              color: 'oklch(0.41 0.2072 300)',
              '&.Mui-checked': {
                color: 'oklch(0.41 0.2072 300)',
              },
              '&.MuiCheckbox-indeterminate': {
                color: 'oklch(0.41 0.2072 300)',
              },
              '&:hover': {
                backgroundColor: 'rgba(102, 54, 185, 0.1)',
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
            className='border-0 font-semibold text-gray-700 dark:text-gray-200'
            sx={{
              borderBottom: '2px solid rgb(229 231 235)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              '.dark &': {
                borderBottom: '2px solid rgb(75 85 99)',
                color: 'rgb(229 231 235)',
              },
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                '&.MuiTableSortLabel-root': {
                  color: 'inherit',
                  fontWeight: 'inherit',
                },
                '&.MuiTableSortLabel-root:hover': {
                  color: 'oklch(0.38 0.22 300)',
                },
                '&.MuiTableSortLabel-root.Mui-active': {
                  color: 'oklch(0.41 0.2072 300)',
                  fontWeight: 700,
                },
                '& .MuiTableSortLabel-icon': {
                  color: 'oklch(0.41 0.2072 300) !important',
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
      pl: { sm: 3 },
      pr: { xs: 2, sm: 2 },
      minHeight: '72px',
    }

    if (numSelected > 0) {
      return [
        baseStyles,
        {
          background:
            'linear-gradient(135deg, oklch(0.41 0.2072 300) 0%, oklch(0.38 0.22 300) 100%)',
          boxShadow: '0 4px 20px rgba(102, 54, 185, 0.3)',
        },
      ]
    }

    return [
      baseStyles,
      {
        background:
          'linear-gradient(135deg, oklch(0.41 0.2072 300) 0%, oklch(0.58 0.185 261) 100%)',
        boxShadow: '0 2px 10px rgba(102, 54, 185, 0.2)',
      },
    ]
  }, [numSelected])

  return (
    <Toolbar className='relative overflow-hidden' sx={toolbarStyles}>
      {/* Decorative elements */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12'></div>
      </div>

      <div className='relative z-10 flex items-center w-full'>
        {numSelected > 0 ? (
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm'>
              <span className='text-lg font-bold text-white'>
                {numSelected}
              </span>
            </div>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='h6'
              component='div'
              className='text-white font-semibold'
            >
              {numSelected} paciente{numSelected > 1 ? 's' : ''} seleccionado
              {numSelected > 1 ? 's' : ''}
            </Typography>
          </div>
        ) : (
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='h5'
              component='div'
              className='text-white font-bold'
            >
              Registro de Pacientes
            </Typography>
          </div>
        )}

        <div className='flex items-center space-x-2'>
          {numSelected > 0 ? (
            <Tooltip title='Eliminar seleccionados' arrow>
              <IconButton
                onClick={onDelete}
                disabled={isDeleting}
                className='bg-white/20 hover:bg-red-500/30 transition-all duration-300'
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                {isDeleting ? (
                  <div className='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
                ) : (
                  <FaTrash className='w-4 h-4' />
                )}
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title='Filtrar lista' arrow>
              <IconButton
                className='bg-white/20 hover:bg-white/30 transition-all duration-300'
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <FaFilter className='w-4 h-4' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
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
      // Obtener el diagnóstico de la última consulta
      const lastConsultation =
        patient.consultations && patient.consultations.length > 0
          ? patient.consultations[patient.consultations.length - 1]
          : null

      return createData(
        patient._id,
        `${patient.firstNames} ${patient.lastNames}`,
        patient.phone || 'N/A',
        patient.birthDate ? formatDate(patient.birthDate) : 'N/A',
        patient.lastConsultationDate
          ? formatDate(patient.lastConsultationDate)
          : 'N/A',
        lastConsultation
          ? lastConsultation.diagnostic || 'No diagnosis'
          : 'No diagnosis'
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
        sx={{
          width: '100%',
          mb: 3,
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          background: '#ffffff',
          '.dark &': {
            background: '#1f2937',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <EnhancedTableToolbar
          onDelete={handleDelete}
          numSelected={selected.length}
          isDeleting={isDeleting}
        />
        <div className='overflow-hidden'>
          <TableContainer
            className='bg-white dark:bg-gray-800'
            sx={{
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'oklch(0.41 0.2072 300)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'oklch(0.38 0.22 300)',
              },
            }}
          >
            <Table
              sx={{
                minWidth: 600,
                '.MuiTableCell-root': {
                  color: 'inherit',
                  borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                  padding: '16px',
                },
                '.MuiTableRow-root': {
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 54, 185, 0.06)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(102, 54, 185, 0.12)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(102, 54, 185, 0.1)',
                    boxShadow: '0 1px 4px rgba(102, 54, 185, 0.2)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(102, 54, 185, 0.15)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 3px 12px rgba(102, 54, 185, 0.25)',
                  },
                },
                '.dark &': {
                  '.MuiTableCell-root': {
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
                  },
                  '.MuiTableRow-root': {
                    '&:hover': {
                      backgroundColor: 'rgba(102, 54, 185, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(102, 54, 185, 0.15)',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(102, 54, 185, 0.2)',
                    },
                  },
                },
              }}
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
                      sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        '&::before': isItemSelected
                          ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '4px',
                              backgroundColor: 'oklch(0.41 0.2072 300)',
                              borderRadius: '0 4px 4px 0',
                            }
                          : {},
                      }}
                      className='group'
                    >
                      <TableCell
                        padding='checkbox'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          sx={{
                            color: 'oklch(0.41 0.2072 300)',
                            '&.Mui-checked': {
                              color: 'oklch(0.41 0.2072 300)',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(102, 54, 185, 0.1)',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        padding='none'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full'>
                            <span className='text-sm font-semibold text-blue-600 dark:text-blue-400'>
                              {row.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div
                              className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-secondary transition-colors'
                              title={row.name}
                            >
                              {row.name.length > 20
                                ? `${row.name.substring(0, 20)}...`
                                : row.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <div className='flex items-center justify-end'>
                          <div className='flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full'>
                            <svg
                              className='w-4 h-4 text-gray-500 dark:text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                              />
                            </svg>
                            <span
                              className='text-sm text-gray-600 dark:text-gray-300'
                              title={row.dni}
                            >
                              {row.dni.length > 12
                                ? `${row.dni.substring(0, 12)}...`
                                : row.dni}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <div className='flex items-center justify-end'>
                          <div className='flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full'>
                            <svg
                              className='w-4 h-4 text-emerald-500'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                            </svg>
                            <span className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
                              {row.birthDate}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <div className='flex items-center justify-end'>
                          <div className='flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full'>
                            <svg
                              className='w-4 h-4 text-amber-500'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                            </svg>
                            <span className='text-sm font-medium text-amber-600 dark:text-amber-400'>
                              {row.lastConsultation}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <div className='flex items-center justify-end'>
                          <div className='flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full max-w-[140px]'>
                            <svg
                              className='w-4 h-4 text-purple-500 flex-shrink-0'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                            <span
                              className='text-sm font-medium text-purple-600 dark:text-purple-400 truncate'
                              title={row.diagnosis}
                            >
                              {row.diagnosis.length > 15
                                ? `${row.diagnosis.substring(0, 15)}...`
                                : row.diagnosis}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{
                          backgroundColor: 'transparent !important',
                          border: 'none',
                        }}
                      >
                        <Tooltip title='Ver ficha del paciente' arrow>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/dashboard-doctor/patients/${row.id}`)
                            }}
                            size='small'
                            variant='outlined'
                            className='group relative overflow-hidden'
                            sx={{
                              borderColor: 'oklch(0.41 0.2072 300)',
                              color: 'oklch(0.41 0.2072 300)',
                              minWidth: '90px',
                              height: '36px',
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                              transition:
                                'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '.dark &': {
                                borderColor: 'white',
                                color: 'white',
                              },
                              '&:hover': {
                                borderColor: 'oklch(0.38 0.22 300)',
                                backgroundColor: 'oklch(0.41 0.2072 300)',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(102, 54, 185, 0.4)',
                              },
                              '&:active': {
                                transform: 'translateY(0)',
                              },
                            }}
                            endIcon={
                              <FaArrowRight className='w-3 h-3 transition-transform duration-300 group-hover:translate-x-1' />
                            }
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
                    sx={{
                      '& .MuiTableCell-root': {
                        backgroundColor: 'transparent !important',
                        border: 'none',
                      },
                    }}
                  >
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            background:
              'linear-gradient(135deg, oklch(0.41 0.2072 300) 0%, oklch(0.58 0.185 261) 100%)',
            color: 'white',
            borderRadius: '0 0 12px 12px',
            '.MuiTablePagination-toolbar': {
              color: 'white',
              padding: '16px 24px',
            },
            '.MuiTablePagination-selectLabel': {
              color: 'white',
              fontWeight: 500,
            },
            '.MuiTablePagination-displayedRows': {
              color: 'white',
              fontWeight: 500,
            },
            '.MuiTablePagination-select': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
            '.MuiTablePagination-selectIcon': {
              color: 'white',
            },
            '.MuiTablePagination-actions': {
              color: 'white',
              '& .MuiIconButton-root': {
                color: 'white',
                margin: '0 2px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'transparent',
                },
              },
            },
          }}
        />
      </Paper>
    </Box>
  )
}
