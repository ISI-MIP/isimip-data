import { useState } from 'react'

export const useDropdown = (initialValue) => {

  const [value, setValue] = useState(initialValue || false)

  return {
    display: value == true,
    show: () => setValue(true),
    hide: () => setValue(false),
    toggle: () => setValue(!value)
  }
}
