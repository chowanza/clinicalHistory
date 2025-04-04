import { useState, useEffect } from 'react'

const useThemeToggle = (darkClass = 'dark') => {
  const [isDarkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode')
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode
      localStorage.setItem('isDarkMode', JSON.stringify(newMode))
      return newMode
    })
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add(darkClass)
    } else {
      document.documentElement.classList.remove(darkClass)
    }
  }, [isDarkMode, darkClass])

  return { isDarkMode, toggleTheme }
}

export default useThemeToggle
