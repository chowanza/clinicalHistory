const RightSidebar = () => {
  return (
    <div className='h-32 sm:h-40 md:h-full grid place-items-center w-full mx-auto p-2 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-5 bg-gradient-to-br from-primary via-primary to-secondary'>
      <div className='grid place-items-center h-full'>
        <img
          src='/auth/med.webp'
          alt='Auth Image'
          className='w-full h-full object-contain max-w-[120px] sm:max-w-[160px] md:max-w-[200px] xl:max-w-none bg-transparent'
        />
      </div>
    </div>
  )
}

export default RightSidebar
