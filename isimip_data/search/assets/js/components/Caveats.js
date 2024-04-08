import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Caveats extends Component {

  render() {
    const { dataset, toggleCaveats } = this.props

    const get_severity = caveats => {
      return caveats.reduce((acc, cur) => {
        if (cur.severity_level > acc.level) {
          return {level: cur.severity_level, color: cur.severity_color, symbol: cur.category_symbol}
        } else {
          return acc
        }
      }, {level: -1, color: 'muted', symbol: 'info'})
    }

    if (dataset.caveats.length > 0) {
      const { color, symbol } = get_severity(dataset.caveats)

      return (
        <div className="float-right">
          <button className={`btn btn-link text-${color}`}>
            <span className="material-symbols-rounded symbols-caveat"
                  title="There are caveats for this dataset."
                  onClick={toggleCaveats}>{symbol}</span>
          </button>
        </div>
      )
    } else if (dataset.caveats_versions.length > 0) {
      const { symbol } = get_severity(dataset.caveats_versions)

      return (
        <div className="float-right">
          <button className="btn btn-link text-muted">
            <span className="material-symbols-rounded symbols-caveat"
                  title="There are caveats for other versions of this dataset."
                  onClick={toggleCaveats}>{symbol}</span>
          </button>
        </div>
      )
    } else {
      return null
    }
  }

}

Caveats.propTypes = {
  dataset: PropTypes.object.isRequired,
  toggleCaveats: PropTypes.func.isRequired
}

export default Caveats
