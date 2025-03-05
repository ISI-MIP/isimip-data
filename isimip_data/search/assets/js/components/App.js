import React, { useEffect } from 'react'
import { isNil } from 'lodash'

import { getLocationParams, getLocationString } from 'isimip_data/metadata/assets/js/utils/location'

import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'
import { useGlossaryQuery, useIdentifiersQuery } from 'isimip_data/metadata/assets/js/hooks/queries'

import { useParams } from '../hooks/params'

import Search from './Search'
import Results from './Results'
import Version from './Version'
import Sidebar from './Sidebar'


const App = () => {

  const [params, setParams, updateParams, resetParams] = useParams({})

  const { data: settings } = useSettingsQuery()
  const { data: glossary } = useGlossaryQuery()
  const { data: identifiers } = useIdentifiersQuery()

  // after the identifiers are fetched, parse the url and initialize params
  useEffect(() => {
    if (!isNil(identifiers)) {
      setParams({
        ...params,
        ...getLocationParams('/search/', window.location.pathname, identifiers.map(i => i.identifier))
      })
    }
  }, [identifiers])

  // update the url everytime params change
  useEffect(() => {
    if (!isNil(identifiers) && !isNil(params)) {
      const pathname = getLocationString('/search/', params)
      if (pathname != window.location.pathname) {
        history.pushState(null, null, pathname)
      }
    }
  }, [params, identifiers])

  if (isNil(settings) || isNil(glossary) || isNil(identifiers)) {
    return null
  }

  return !isNil(settings) && !isNil(glossary) && !isNil(identifiers) && (
    <div className="row">
      <div className="col-lg-12">
        <Search
          params={params}
          updateParams={updateParams}
          resetParams={resetParams}
        />
      </div>
      <div className="col-lg-3">
        <Sidebar
          params={params}
          glossary={glossary}
          updateParams={updateParams}
        />
      </div>
      <div className="col-lg-9">
        <Version
          params={params}
          updateParams={updateParams}
        />
        <Results
          params={params}
          pageSize={parseInt(settings.METADATA_PAGE_SIZE)}
          maxCount={parseInt(settings.METADATA_MAX_COUNT)}
          glossary={glossary}
          updateParams={updateParams}
        />
      </div>
    </div>
  )
}

export default App
