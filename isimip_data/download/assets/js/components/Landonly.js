import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Landonly extends Component {

  render() {
    const { selected, onSelect } = this.props

    return (
      <div className="row download-row align-items-center">
        <div className="col-md-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" type="radio" name="landonly" id="check-landonly"
                onChange={() => onSelect('landonly')} checked={selected == 'landonly'} />

            <label className="form-check-label" htmlFor="check-landonly">Mask only land data</label>
          </div>
        </div>
      </div>
    )
  }
}

Landonly.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default Landonly
