import React, { Component} from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

class Filter extends React.Component {

  render() {
    const { filterString, showAll, onFilterStringChange, onShowAllChange } = this.props

    return (
      <div className="filter card mb-2">
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 mb-2 col-md mb-md-0">
              <input className="form-control form-control-lg mb-1" type="text" placeholder="Filter by DOI, title, creator, or path"
                     onChange={e => onFilterStringChange(e.target.value)} value={filterString} />
              <div className="float-md-right text-muted">
                The list of DOI will update as you type.
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="show-all-checkbox"
                       checked={showAll} onChange={e => onShowAllChange(!showAll)} />
                <label className="form-check-label" htmlFor="show-all-checkbox">
                  Show older DOI versions as well
                </label>
              </div>
            </div>
            <div className="col-6 col-md-auto">
              <button className="btn btn-outline-secondary btn-lg w-100" type="button" onClick={e => onFilterStringChange('')}>
                Reset <FontAwesomeIcon className="fa-fw" icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Filter
