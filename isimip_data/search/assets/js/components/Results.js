import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNil } from 'lodash'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'

import { useDatasetsQuery } from 'isimip_data/metadata/assets/js/hooks/queries'

import Params from './Params'
import Result from './Result'
import Selection from './Selection'
import LoadMore from './LoadMore'
import Suggestions from './Suggestions'


const Results = ({ params, maxCount, glossary, updateParams }) => {

  const [selected, setSelected] = useLsState('result.selected', [])  // todo lsstate

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useDatasetsQuery(params)
  const count = isNil(data) ? 0 : data.pages[0].count
  const results = isNil(data) ? [] : data.pages.reduce((results, page) => {
    return [...results, ...page.results]
  }, [])

  return (
    <div className="results">
      <Selection
        selected={selected}
        setSelected={setSelected}
        count={count}
        maxCount={maxCount}
        isLoading={isLoading}
      />
      {
        !isEmpty(params) && <Params params={params} count={count} updateParams={updateParams} />
      }
      {
        !isLoading && (count == 0) && <Suggestions params={params} updateParams={updateParams} />
      }
      {
        results.map(dataset => {
          return (
            <Result
              key={dataset.id}
              dataset={dataset}
              glossary={glossary}
              selected={selected}
              setSelected={setSelected}
            />
          )
        })
      }
      {hasNextPage && <LoadMore onClick={fetchNextPage} isFetching={isFetching} />}
    </div>
  )
}

Results.propTypes = {
  params: PropTypes.object.isRequired,
  maxCount: PropTypes.number.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Results
