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


const Operation = ({ operation, index, values, errors, updateOperation, removeOperation }) => {
  const error = []

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
              errors={errors}
              onChange={bbox => updateOperation(index, {...values, bbox})}
            />
          )
        }
        {
          !isUndefined(values.point) && (
            <Point
              point={values.point}
              errors={errors}
              onChange={point => updateOperation(index, {...values, point})}
            />
          )
        }
        {
          !isUndefined(values.country) && (
            <Country
              country={values.country}
              errors={errors}
              onChange={country => updateOperation(index, {...values, country})}
            />
          )
        }
        {
          !isUndefined(values.mask) && (
            <Mask
              file={values.mask_file}
              accept={{
                'application/x-hdf': ['.nc', '.nc4']
              }}
              errors={errors.mask_file}
              onChange={mask => updateOperation(index, {...values, mask_file})}
            />
          )
        }
        {
          !isUndefined(values.shape) && (
            <Mask
              file={values.shape_file}
              accept={{
                'application/json': ['.json'],
                'application/zip': ['.zip']
              }}
              errors={errors.shape_file}
              onChange={shape => updateOperation(index, {...values, shape_file})}
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
          !isUndefined(values.compute_mean) && (
            <Mean
              checked={values.compute_mean}
              errors={errors}
              onChange={compute_mean => updateOperation(index, {...values, compute_mean})}
            />
          )
        }
        {
          !isUndefined(values.output_csv) && (
            <Csv
              checked={values.output_csv}
              errors={errors}
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
  values: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  updateOperation: PropTypes.func.isRequired,
  removeOperation: PropTypes.func.isRequired
}

export default Operation
