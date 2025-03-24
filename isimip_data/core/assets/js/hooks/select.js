import { useState } from 'react'

export const useSelect = (initialValue) => {

  const [value, setValue] = useState(initialValue)

  return [value, (newValue) => {
    setValue((value == newValue) ? initialValue : newValue)
  }]
}
