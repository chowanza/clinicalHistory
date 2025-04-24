import TextField from '@mui/material/TextField'

const PatientSearchBar = ({ filter, setFilter }) => {
  return (
    <div className='bg-primary rounded-t-xl w-96 p-5 flex items-center justify-between'>
      <TextField
        label='Filter by Name'
        variant='outlined'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        sx={{
          input: {
            color: 'white',
          },
          label: {
            color: 'white',
            fontSize: '1.1rem',
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
