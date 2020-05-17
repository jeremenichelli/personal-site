// attach listener to dark toggle
const toggle = document.querySelector('.colorScheme--toggle')

// make it visible
toggle.classList.add('colorScheme--toggle__visible')

// add click event
toggle.addEventListener('click', () => {
  try {
    const storedDarkMode = JSON.parse(localStorage.getItem('dark-mode'))
    const newDarkModeValue = !storedDarkMode
    localStorage.setItem('dark-mode', newDarkModeValue)
    document.documentElement.classList.toggle(
      'colorScheme--dark',
      newDarkModeValue
    )
  } catch (error) {
    if (__DEV__) console.error(error)
  }
})
