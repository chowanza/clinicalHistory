import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='absolute bottom-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6 mt-auto w-full rounded-t-4xl shadow-2xl'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='flex flex-col justify-center gap-2 items-center text-sm text-gray-600 dark:text-gray-400'>
          <div className='mb-3 md:mb-0 text-center md:text-left'>
            <span className='font-semibold text-gray-800 dark:text-gray-200'>
              Clinical History
            </span>
            <span className='mx-2'>•</span>
            <span>Desarrollado por</span>
            <span className='font-semibold text-blue-600 dark:text-blue-400 ml-1'>
              TechLab
            </span>
          </div>
          <div className='text-center md:text-right'>
            © {currentYear} Clinical History. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
