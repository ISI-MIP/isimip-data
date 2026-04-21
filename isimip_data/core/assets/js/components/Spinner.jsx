import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'


const Spinner = ({ size, className }) => (
  <div className={classNames('spinner-border', {
    'spinner-border-xs': size == 'xs',
    'spinner-border-sm': size == 'sm',
    'spinner-border-lg': size == 'lg',
    [className]: !isEmpty(className)
  })} role="status">
    <span className="visually-hidden">Loading</span>
  </div>
)

Spinner.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string
}

export default Spinner
