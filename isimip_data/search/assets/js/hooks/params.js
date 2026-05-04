import { useState } from 'react'
import { isEmpty, isNil } from 'lodash'

export const useParams = () => {

  const [params, setParams] = useState(null)  // null until URL is parsed

  const updateParams = (inputParams) => {
    const updatedParams = { ...params }

    Object.entries(inputParams).forEach(([key, value]) => {
      if (isNil(value) || isEmpty(value)) {
        delete updatedParams[key]
      } else {
        updatedParams[key] = value
      }
    })

    setParams(updatedParams)
  }

  const resetParams = () => setParams({})

  return [params, setParams, updateParams, resetParams]
}
