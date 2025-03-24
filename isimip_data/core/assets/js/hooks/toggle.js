import { useState } from 'react'

export const useToggle = (initialValue) => {

  const [value, setValue] = useState(initialValue || false)

  return [value, () => {
    setValue(!value)
  }]
}
