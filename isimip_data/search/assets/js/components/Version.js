import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty, isNil, omit } from 'lodash'


const Version = ({ params, updateParams }) => {

  const [values, setValues] = useState({
    show: false,
    after: '',
    before: ''
  })

  useEffect(() => {
    setValues({
      show: !isEmpty(params.after) || !isEmpty(params.before),
      after: params.after || '',
      before: params.before || ''
    })
  }, [params])

  const toggleVersion = () => {
    if (values.show) {
      setValues({ ...values, show: false })
      updateParams({ after: null, before: null })
    } else {
      setValues({ ...values, show: true })
    }
  }

  const toggleAll = () => {
    updateParams({ all: params.all ? null : 'true' })
  }

  const handleApply = () => {
    updateParams({ ...omit(values, ['show']) })
  }

  return (
    <div className="card version">
      <div className="card-header d-md-flex">
        <div className="form-check form-check-inline mb-2 mb-md-0">
          <input className="form-check-input" type="checkbox" id="specific-versions-checkbox"
                 checked={values.show} onChange={toggleVersion} />
          <label className="form-check-label" htmlFor="specific-versions-checkbox">
            Show specific versions with date constraints
          </label>
        </div>
        <div className="form-check form-check-inline ml-auto mr-0">
          <input className="form-check-input" type="checkbox" id="archived-versions-checkbox"
                 checked={!isNil(get(params, 'all'))} onChange={toggleAll} />
          <label className="form-check-label" htmlFor="archived-versions-checkbox">Show archived files</label>
        </div>
      </div>
      {
        values.show && (
          <ul className="list-group list-group-flush">
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
                  <button className="btn btn-default btn-sm" onClick={handleApply}>Apply range</button>
                </div>
              </div>
            </li>
          </ul>
        )
      }
    </div>
  )
}

Version.propTypes = {
  params: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Version
