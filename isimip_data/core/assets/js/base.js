document.addEventListener('DOMContentLoaded', () => {
    for (const element of document.getElementsByClassName('copy-to-clipboard')) {
        element.addEventListener('click', () => {
            const code = element.getElementsByTagName('code')[0]
            const text = code.textContent
            navigator.clipboard.writeText(text)
        })
    }
})
