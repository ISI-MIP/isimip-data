import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { isUndefined } from 'lodash'

import Html from 'isimip_data/core/assets/js/components/Html'

import BBox from './widgets/BBox'
import Country from './widgets/Country'
import Csv from './widgets/Csv'
import Layer from './widgets/Layer'
import Mask from './widgets/Mask'
import Mean from './widgets/Mean'
import Point from './widgets/Point'
import Var from './widgets/Var'

const Operation = ({ operation, index, isLast, values, errors, updateOperation, removeOperation }) => {
  return (
    <div className="card mb-2 operation">
      <div className="card-body">
        <button type="button" className="btn btn-link close-operation" onClick={() => removeOperation(index)}>
          <span className="material-symbols-rounded">close</span>
        </button>

        <h5 className="card-title">{operation.title}</h5>
        <div className="mb-2">
          <Html html={operation.template} />
        </div>

        <div className="form-row">
        {
          !isUndefined(values.bbox) && (
            <BBox
              bbox={values.bbox}
              errors={errors.bbox}
              onChange={bbox => updateOperation(index, {...values, bbox})}
            />
          )
        }
        {
          !isUndefined(values.point) && (
            <Point
              point={values.point}
              errors={errors.point}
              onChange={point => updateOperation(index, {...values, point})}
            />
          )
        }
        {
          !isUndefined(values.country) && (
            <Country
              country={values.country}
              errors={errors.country}
              onChange={country => updateOperation(index, {...values, country})}
            />
          )
        }
        {
          !isUndefined(values.mask) && (
            <Mask
              file={values.mask}
              accept={operation.accept}
              errors={errors.mask}
              onChange={mask => updateOperation(index, {...values, mask})}
            />
          )
        }
        {
          !isUndefined(values.shape) && (
            <Mask
              file={values.shape}
              accept={operation.accept}
              errors={errors.shape}
              onChange={shape => updateOperation(index, {...values, shape})}
            />
          )
        }
        {
          !isUndefined(values.var) && (
            <Var
              value={values.var}
              errors={errors.var}
              onChange={value => updateOperation(index, {...values, var: value})}
            />
          )
        }
        {
          !isUndefined(values.layer) && (
            <Layer
              value={values.layer}
              errors={errors.layer}
              onChange={layer => updateOperation(index, {...values, layer})}
            />
          )
        }
        {
          isLast && !isUndefined(values.compute_mean) && (
            <Mean
              checked={values.compute_mean}
              errors={errors.mean}
              onChange={compute_mean => updateOperation(index, {
                ...values,
                compute_mean,
                output_csv: !compute_mean ? false : values.output_csv  // unset output_csv if compute_mean is unset
              })}
            />
          )
        }
        {
          isLast && values.compute_mean && !isUndefined(values.output_csv) && (
            <Csv
              checked={values.output_csv}
              errors={errors.csv}
              onChange={output_csv => updateOperation(index, {...values, output_csv})}
            />
          )
        }
        </div>
      </div>
    </div>
  )
}

Operation.propTypes = {
  operation: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateOperation: PropTypes.func.isRequired,
  removeOperation: PropTypes.func.isRequired
}

export default Operation
