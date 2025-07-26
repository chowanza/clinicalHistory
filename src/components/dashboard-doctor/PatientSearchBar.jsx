import TextField from '@mui/material/TextField'

const PatientSearchBar = ({ filter, setFilter }) => {
  return (
    <div className='bg-primary rounded-t-xl w-full sm:w-80 md:w-96 p-3 sm:p-5 flex items-center justify-between'>
      <TextField
        label='Filtrar por Nombre'
        variant='outlined'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        size="small"
        sx={{
          input: {
            color: 'white',
            fontSize: '0.875rem',
            '@media (min-width: 640px)': {
              fontSize: '1rem',
            },
          },
          label: {
            color: 'white',
            fontSize: '0.875rem',
            '@media (min-width: 640px)': {
              fontSize: '1.1rem',
            },
          },
          '& label.Mui-focused': {
            color: 'white',
            fontWeight: 900,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
        }}
      />
    </div>
  )
}

export default PatientSearchBar
