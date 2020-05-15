import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Landonly extends Component {

  render() {
    const { selected, onSelect } = this.props

    return (
      <div>
        <div className="download-form-row form-check form-check-inline">
          <input className="form-check-input" type="radio" name="landonly" id="check-landonly"
              onChange={() => onSelect('landonly')} checked={selected == 'landonly'} />

          <label className="form-check-label" htmlFor="check-landonly">Mask only land data</label>
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
