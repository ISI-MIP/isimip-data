import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = { value: ''}
    this.setValue = this.setValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  setValue(e) {
    this.setState({ value: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.value)
  }

  handleReset(e) {
    this.setState({ value: '' })
    this.props.onReset()
  }

  render() {
    const { value } = this.state

    return (
      <div className="search">
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
                onChange={this.setValue} value={value} />
            <div className="input-group-append">
              <button className="btn btn-outline-warning" type="button" onClick={this.handleReset}>
                <FontAwesomeIcon className="fa-fw" icon={faTimes} />
              </button>
              <button className="btn btn-outline-success" type="button" onClick={this.handleSubmit}>
                <FontAwesomeIcon className="fa-fw" icon={faSearch} />
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default Search
