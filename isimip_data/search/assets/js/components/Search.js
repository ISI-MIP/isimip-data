import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = { value: this.props.params.search }
    this.setValue = this.setValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.search !== prevProps.params.search) {
      this.setState({ value: this.props.params.search })
    }
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
          <div className="form-row">
            <div className="col-lg">
              <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
                  onChange={this.setValue} value={value} />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary btn-lg" type="button" onClick={this.handleSubmit}>
                Search <FontAwesomeIcon className="fa-fw" icon={faSearch} />
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-secondary btn-lg" type="button" onClick={this.handleReset}>
                Reset <FontAwesomeIcon className="fa-fw" icon={faTimes} />
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

Search.propTypes = {
  params: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default Search
