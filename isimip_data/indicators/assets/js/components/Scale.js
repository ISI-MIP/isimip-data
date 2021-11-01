import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Scale extends Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      width: 0
    }
  }

  componentDidMount() {
    this.setState({ width: this.ref.current.offsetWidth })
  }

  render() {
    const { value, minimum, maximum } = this.props
    const { width } = this.state

    const ratio = width / (maximum - minimum)
    const lineLeft = Math.max(Math.min((value - minimum) * ratio, width), 0) + 6

    return (
      <div className="value-scale" ref={this.ref}>
        <div className="value-scale-background"></div>
        <div className="value-scale-line" style={{left: lineLeft}}></div>
        <div className="value-scale-number" style={{top: 4, textAlign: 'center', fontWeight: 'bold', color: 'black'}}>
          {value}
        </div>
        <div className="value-scale-number" style={{textAlign: 'left'}}>{minimum.toFixed(1)}</div>
        <div className="value-scale-number" style={{textAlign: 'right'}}>{maximum.toFixed(1)}</div>
      </div>
    )
  }
}

Scale.propTypes = {
  value: PropTypes.number.isRequired,
  minimum: PropTypes.number.isRequired,
  maximum: PropTypes.number.isRequired
}

export default Scale
