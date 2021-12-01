import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Range extends Component {

  render() {
    const { domain, values, onChange } = this.props
    const [ min, max ] = domain
    const [ startYear, endYear ] = values

    return (
      <div className="range">
        <input type="range" value={startYear} min={min} max={max} className="thumb thumb-3"
               onChange={e => onChange('start_year', e.target.value)} />
        <input type="range" value={endYear} min={min} max={max} className="thumb thumb-4"
               onChange={e => onChange('end_year', e.target.value)} />
        <div className="slider">
          <div className="track"/>
          <div className="ticks">
            <div style={{left: 0}}>{min}</div>
            <div style={{right: 0}}>{max}</div>
          </div>
        </div>
      </div>
    )
  }
}

Range.propTypes = {
  domain: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Range
