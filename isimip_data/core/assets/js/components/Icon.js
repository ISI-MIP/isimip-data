/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


const Icon = ({ className, icon, size, title }) => (
  <>
    {title && <span className="visually-hidden">{title}</span>}
    <span className={classNames(className, 'material-symbols-rounded', {
      'material-symbols-rounded-sm': size == 'sm',
      'material-symbols-rounded-lg': size == 'lg',
      'material-symbols-rounded-xl': size == 'xl'
    })} aria-hidden="true">{icon}</span>
  </>
)

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
}

export default Icon
