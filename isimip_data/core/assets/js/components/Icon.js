/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'


const Icon = ({ icon, size, ...props }) => (
  <>
    {props.title && <span className="visually-hidden">{props.title}</span>}
    <span className={classNames('material-symbols-rounded align-self-center', {
      [props.className]: !isEmpty(props.className),
      'material-symbols-rounded-sm': size == 'sm',
      'material-symbols-rounded-lg': size == 'lg'
    })} aria-hidden="true" {...props}>{icon}</span>
  </>
)

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string
}

export default Icon
