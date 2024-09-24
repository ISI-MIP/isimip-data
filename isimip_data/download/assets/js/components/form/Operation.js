import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { isUndefined } from 'lodash'


// import Html from 'isimip_data/core/assets/js/components/Html'

import Country from './widgets/Country'
import BBox from './widgets/BBox'
import Csv from './widgets/Csv'
import Mean from './widgets/Mean'
import Point from './widgets/Point'

const Operation = ({ operation, operationIndex, operationValues, operationErrors,
                     updateOperation, removeOperation }) => {
  const error = []

  return (
    <div className="card mb-2 operation">
      <div className="card-body">
        <button type="button" className="btn btn-link close-operation" onClick={() => removeOperation(operationIndex)}>
          <span className="material-symbols-rounded">close</span>
        </button>

        <h5 className="card-title">{operation.title}</h5>
        <div className="mb-2">
          <Markdown>{operation.help}</Markdown>
        </div>
        {
          !isUndefined(operationValues.bbox) && (
            <BBox
              bbox={operationValues.bbox}
              errors={operationErrors}
              onChange={bbox => updateOperation(operationIndex, {...operationValues, bbox})}
            />
          )
        }
        {
          !isUndefined(operationValues.point) && (
            <Point
              point={operationValues.point}
              errors={operationErrors}
              onChange={point => updateOperation(operationIndex, {...operationValues, point})}
            />
          )
        }
        {
          !isUndefined(operationValues.country) && (
            <Country
              country={operationValues.country}
              errors={operationErrors}
              onChange={country => updateOperation(operationIndex, {...operationValues, country})}
            />
          )
        }
        {
          !isUndefined(operationValues.compute_mean) && (
            <Mean
              checked={operationValues.compute_mean}
              errors={operationErrors}
              onChange={compute_mean => updateOperation(operationIndex, {...operationValues, compute_mean})}
            />
          )
        }
        {
          !isUndefined(operationValues.output_csv) && (
            <Csv
              checked={operationValues.output_csv}
              errors={operationErrors}
              onChange={output_csv => updateOperation(operationIndex, {...operationValues, output_csv})}
            />
          )
        }
      </div>
    </div>
  )
}

Operation.propTypes = {
  operation: PropTypes.object.isRequired,
  operationIndex: PropTypes.number.isRequired,
  operationValues: PropTypes.object.isRequired,
  updateOperation: PropTypes.func.isRequired,
  removeOperation: PropTypes.func.isRequired
}

export default Operation
