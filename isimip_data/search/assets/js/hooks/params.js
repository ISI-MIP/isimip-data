import { useState } from 'react'
import { isNil, isEmpty } from 'lodash'

export const useParams = (initalParams) => {

  const [params, setParams] = useState(initalParams)

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
