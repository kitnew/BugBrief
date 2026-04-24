function scrollToSection(targetSelector: string) {
  const target = document.querySelector(targetSelector)

  if (!target) {
    return
  }

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function setupNavigationBehavior() {
  document.querySelectorAll<HTMLAnchorElement>('.main-nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()

      const targetSelector = link.getAttribute('href')

      if (!targetSelector) {
        return
      }

      scrollToSection(targetSelector)
      link.blur()
    })
  })
}
