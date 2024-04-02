import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Caveats extends Component {

  render() {
    const { dataset, toggleCaveats } = this.props

    const get_caveats_color = caveats => {
      const [level, color] = caveats.reduce((acc, cur) => {  // eslint-disable-line no-unused-vars
        const [acc_level, acc_color] = acc  // eslint-disable-line no-unused-vars
        if (cur.severity_level > acc_level) {
          return [cur.severity_level, cur.severity_color]
        } else {
          return acc
        }
      }, [-1, 'muted'])

      return color
    }

    if (dataset.caveats.length > 0) {
      return (
        <div className={'float-right text-' + get_caveats_color(dataset.caveats)}>
          <span className="material-symbols-rounded symbols-caveat"
                title="There are caveats for this dataset."
                onClick={toggleCaveats}>warning_amber</span>
        </div>
      )
    } else if (dataset.caveats_versions.length > 0) {
      return (
        <div className={'float-right text-primary'}>
          <span className="material-symbols-rounded symbols-caveat"
                title="There are caveats for other versions of this dataset."
                onClick={toggleCaveats}>warning_amber</span>
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
