import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Range from './widgets/Range'

const Paths = ({ files, errors, paths, setPaths }) => {
  // compute if files are checked
  const allChecked = (files.length == paths.length)

  // compute the start_year/end_year of the files in this.props.files
  const initialRange = files.reduce((acc, cur) => {
    let [start_year, end_year] = acc

    if (cur.specifiers.start_year && cur.specifiers.start_year < start_year) {
      start_year = cur.specifiers.start_year
    }
    if (cur.specifiers.end_year && cur.specifiers.end_year > end_year) {
      end_year = cur.specifiers.end_year
    } else if (cur.specifiers.start_year && cur.specifiers.start_year > end_year) {
      // workaround for files with a start_year, but no end_year
      end_year = cur.specifiers.start_year
    }

    return [start_year, end_year]
  }, [2100, 1600])

  const [state, setState] = useState({
    mode: 'range',
    rangeDomain: initialRange,
    rangeValues: initialRange,
  })

  const handleRangeChange = (specifier, value) => {
    let [startYear, endYear] = state.rangeValues

    if (specifier == 'start_year') {
      startYear = (value < endYear) ? value : startYear
    } else if (specifier == 'end_year') {
      endYear = (value > startYear) ? value : endYear
    }

    setPaths(
      files.filter(file => (
        (file.specifiers.start_year === undefined) ||
        (file.specifiers.start_year >= startYear && file.specifiers.start_year <= endYear)
      )).map(file => file.path)
    )

    setState({ ...state, rangeValues: [startYear, endYear] })
  }

  const togglePath = (path) => {
    if (paths.includes(path)) {
      setPaths(paths.filter(item => item != path))
    } else {
      setPaths([...paths, path])
    }
  }

  const toggleAll = () => {
    if (allChecked) {
      setPaths([])
    } else {
      setPaths(files.map(file => file.path))
    }
  }

  return (
    <div>
      <h3>File selection</h3>

      <div className="card mb-2">
        <div className="card-body">
          <div className="form-check form-check-inline mb-0">
            <input className="form-check-input" type="radio" id="range-radio"
                   onChange={() => setState({...state, mode: 'range'})} checked={state.mode == 'range'} />
            <label className="form-check-label" htmlFor="range-radio">
              Select files by time range
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" id="files-radio"
                   onChange={() => setState({...state, mode: 'files'})} checked={state.mode == 'files'} />
            <label className="form-check-label" htmlFor="files-radio">
              Select individual files
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {
            state.mode == 'range' && <div>
              <Range domain={state.rangeDomain} values={state.rangeValues} onChange={handleRangeChange} />
              <div className="text-center">
                <span className="me-3"><strong>Number of files:</strong> {paths.length}</span>
                <span className="me-3"><strong>Start year:</strong> {state.rangeValues[0]}</span>
                <span><strong>End year:</strong> {state.rangeValues[1]}</span>
              </div>
            </div>
          }
          {
            state.mode == 'files' && <>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="check-all"
                       checked={allChecked}
                       onChange={() => toggleAll()} />
                <label className="form-check-label text-muted" htmlFor="check-all">
                  {allChecked ? <span>Uncheck all</span> : <span>Check all</span>}
                </label>
              </div>
              {
                files.map((file, index) => {
                  return (
                    <div className="form-check mt-2" key={index}>
                      <input className="form-check-input" type="checkbox" id={index}
                             checked={paths.includes(file.path)}
                             onChange={() => togglePath(file.path)} />
                      <label className="form-check-label" htmlFor={index}>{file.path}</label>
                    </div>
                  )
                })
              }
            </>
          }
          {
            errors.paths && (
              <div className="mt-2">
                {
                  errors.paths.map((error, index) => <p className="text-danger" key={index}>{error}</p>)
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

Paths.propTypes = {
  files: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  paths: PropTypes.array.isRequired,
  setPaths: PropTypes.func.isRequired
}

export default Paths
