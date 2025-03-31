import React, { useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import { Popover as BootstrapPopover } from 'bootstrap'

const Popover = ({ children, ...props }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (props.title || props.content) {
      const { title, content, ...otherProps } = props
      const t = new BootstrapPopover(ref.current, {
        title: renderToString(title),
        content: renderToString(content),
        html: true,
        trigger: 'hover',
        placement: 'bottom',
        ...otherProps
      })
      return () => t.dispose()
    }
  }, [props])

  return React.cloneElement(children, { ref })
}

Popover.propTypes = {
  children: PropTypes.node.isRequired
}

export default Popover
