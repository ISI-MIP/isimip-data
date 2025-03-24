import React, { useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import { Tooltip as BootstrapTooltip } from 'bootstrap'

const Tooltip = ({ children, ...props }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (props.title) {
      const { title, ...otherProps } = props
      const t = new BootstrapTooltip(ref.current, {
        html: true, trigger: 'hover', placement: 'bottom', ...otherProps, title: renderToString(title)
      })
      return () => t.dispose()
    }
  }, [props])

  return React.cloneElement(children, { ref })
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired
}

export default Tooltip
