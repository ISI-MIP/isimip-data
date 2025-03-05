import React from 'react'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'

import Filter from './Filter'
import Resources from './Resources'


const App = () => {

  const [values, setValues] = useLsState('resources', {
    showAll: false,
    filterString: ''
  })

  return (
    <div>
      <Filter values={values} setValues={setValues} />
      <Resources values={values} />
    </div>
  )
}

export default App
