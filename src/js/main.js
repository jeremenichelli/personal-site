// attach listener to dark toggle
const toggle = document.querySelector('.dark--toggle')

// make it visible
toggle.classList.add('dark--toggle__visible')

// add click event
toggle.addEventListener('click', () => {
  try {
    const storedDarkMode = JSON.parse(localStorage.getItem('dark-mode'))
    const newDarkModeValue = !storedDarkMode
    localStorage.setItem('dark-mode', newDarkModeValue)
    document.documentElement.classList.toggle('dark', newDarkModeValue)
  } catch (error) {
    if (__DEV__) console.error(error)
  }
})
