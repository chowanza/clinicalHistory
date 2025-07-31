import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import useThemeToggle from '../../hooks/useThemeToggle'

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 0,
    padding: 4,
    transform: 'translateX(0px)',
    transition: 'transform 0.3s ease-in-out',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(24px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: '#1e293b',
        '&:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            '#fbbf24'
          )}" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>')`,
        },
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#334155',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#f8fafc',
    width: 20,
    height: 20,
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease-in-out',
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      borderRadius: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '16px 16px',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#64748b'
      )}" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>')`,
    },
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    opacity: 1,
    transition: 'background-color 0.3s ease-in-out',
  },
}))

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeToggle()

  return (
    <div className='relative group'>
      <ThemeSwitch
        onClick={toggleTheme}
        checked={isDarkMode}
        inputProps={{ 'aria-label': 'Toggle dark mode' }}
      />
      {/* Tooltip simple */}
      <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap'>
        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </div>
    </div>
  )
}

export default ThemeToggle
