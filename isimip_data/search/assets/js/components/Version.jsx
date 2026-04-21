import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty, isNil, omit } from 'lodash'

import Checkbox from 'isimip_data/core/assets/js/components/Checkbox'
import Spinner from 'isimip_data/core/assets/js/components/Spinner'

const Version = ({ count, maxCount, isLoading, params, updateParams }) => {

  const [values, setValues] = useState({
    display: false,
    after: '',
    before: ''
  })

  useEffect(() => {
    setValues({
      display: !isEmpty(params.after) || !isEmpty(params.before),
      after: params.after || '',
      before: params.before || ''
    })
  }, [params])

  const toggleVersion = () => {
    if (values.display) {
      setValues({ ...values, display: false })
      updateParams({ after: null, before: null })
    } else {
      setValues({ ...values, display: true })
    }
  }

  const toggleAll = () => {
    updateParams({ all: params.all ? null : 'true' })
  }

  const handleApply = () => {
    updateParams({ ...omit(values, ['display']) })
  }

  return (
    <div className="card">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="d-md-flex">
            <div className="me-md-auto mb-2 mb-md-0">
              {
                isLoading && (
                  <div className="d-flex align-items-center version-spinner">
                    <Spinner size="sm" className="text-secondary" />
                  </div>
                )
              }
              {
                !isLoading && count >= 0 && count <= maxCount && (
                  <div>{ count.toLocaleString('en-US') } datasets found</div>
                )
              }
              {
                !isLoading && count > maxCount && (
                  <div>More than { maxCount.toLocaleString('en-US') } datasets found</div>
                )
              }
            </div>
            <Checkbox className="mb-2 mb-md-0 me-2" checked={values.display} onChange={toggleVersion}>
              Show specific versions
            </Checkbox>
            <Checkbox checked={!isNil(get(params, 'all'))} onChange={toggleAll}>
              Show archived files
            </Checkbox>
          </div>
        </li>
        {
          values.display && (
            <li className="list-group-item">
              <div className="row align-items-center">
                <div className="col-12 col-md-auto mb-2 mb-md-0">
                  <label className="form-check-label">Version range:</label>
                </div>
                <div className="col-12 col-md mb-2 mb-md-0">
                  <input type="number" className="form-control form-control-sm" placeholder="After YYYYMMDD"
                         value={values.after}
                         onChange={(event) => setValues({...values, after: event.target.value})} />
                </div>
                <div className="col-12 col-md-auto mb-2 mb-md-0">
                  <label className="form-check-label">≤ Dataset version ≤</label>
                </div>
                <div className="col-12 col-md mb-2 mb-md-0">
                  <input type="number" className="form-control form-control-sm" placeholder="Before YYYYMMDD"
                         value={values.before}
                         onChange={(event) => setValues({...values, before: event.target.value})} />
                </div>
                <div className="col-12 col-md-auto">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleApply}>Apply range</button>
                </div>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  )
}

Version.propTypes = {
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Version
