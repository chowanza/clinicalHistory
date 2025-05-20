import VaccinationScheduleRow from './VaccinationScheduleRow'

const VaccinationSchedule = () => {
  const rowsTitle = [
    'Tuberculosis',
    'Polio',
    'Pentavalente O Hexavalente',
    'Hepatitis B',
    'Sarampión, Rubeola, Parotiditis (Trivalente Viral)',
    'Hepatitis A',
    'Varicela (Lechina)',
    'Neumococo',
    'Meningococo',
    'Rotavirus',
    'Fiebre Amarilla',
    'Tetraxim',
    'Adacel (Tosferina)',
    'Toxoide',
    'VPH',
    'Antigripal',
    'COVID',
  ]

  return (
    <div className='flex justify-center flex-col gap-6 pt-6'>
      <h1 className='font-bold text-2xl self-center'>Tarjeta de Vacunación</h1>
      <div className='flex flex-col'>
        <div className='flex justify-center items-center gap-4 w-full'>
          <div className='w-2/5'></div>
          <div className='w-3/5 flex justify-center items-center text-fuchsia-600 text-center font-semibold'>
            <span className='w-1/5'>1era Dosis</span>
            <span className='w-1/5'>2da Dosis</span>
            <span className='w-1/5'>3era Dosis</span>
            <span className='w-1/5'>Refuerzo</span>
            <span className='w-1/5'>Refuerzo</span>
          </div>
        </div>
        {/* rows */}
        {Array.from({ length: 17 }, (_, index) => (
          <VaccinationScheduleRow key={index} title={rowsTitle[index]} />
        ))}
      </div>
    </div>
  )
}

export default VaccinationSchedule
