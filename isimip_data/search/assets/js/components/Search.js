import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.setValue = this.setValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.query !== prevProps.params.query) {
      this.setState({ value: this.props.params.query || '' })
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
      <div className="search card">
        <div className="card-body">
          <h1 className="card-title">Search the ISIMIP Repository</h1>

          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="col-12 mb-2 col-md mb-md-0">
                <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
                    onChange={this.setValue} value={value} />
              </div>
              <div className="col-6 col-md-auto">
                <button className="btn btn-outline-primary btn-lg w-100" type="button" onClick={this.handleSubmit}>
                  Search <span className="material-symbols-rounded symbols-search">search</span>
                </button>
              </div>
              <div className="col-6 col-md-auto">
                <button className="btn btn-outline-secondary btn-lg w-100" type="button" onClick={this.handleReset}>
                  Reset <span className="material-symbols-rounded symbols-reset">close</span>
                </button>
              </div>
            </div>
          </form>
        </div>
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
