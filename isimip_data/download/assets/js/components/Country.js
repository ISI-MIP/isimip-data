import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DownloadApi from '../api/DownloadApi'


class Country extends Component {

  constructor(props) {
    super(props)
    this.state = {
      countries: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    DownloadApi.fetchCountries().then(countries => {
      this.setState({ countries })
    })
  }

  handleChange(e) {
    const { name } = this.props

    this.props.onSelect(name)
    this.props.onChange(e.target.value)
  }

  render() {
    const { name, task, country, countryError, onSelect, label, help } = this.props
    const { error, countries } = this.state
    const htmlId = 'check-' + name
    const checked = (task == name)

    return (
      <div className="row download-row align-items-center">
        <div className="col-md-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" className="form-check-input"
                type="radio" name="country" id={htmlId}
                onChange={() => onSelect(name)} checked={checked} />

            <label className="form-check-label" htmlFor={htmlId}>{label}</label>
          </div>
        </div>
        <div className="col-md-8 mb-2">
          <select className={'form-control download-form-input-country ' + (checked && countryError && 'is-invalid')}
              value={checked ? country : ''} onChange={this.handleChange}>

            <option disabled value="">Choose...</option>
            {
              countries.map(item => {
                return <option key={item.key} value={item.key}>{item.long_name}</option>
              })
            }
          </select>
        </div>
        <div className="col-lg-12 mb-2">
          <p className="text-muted small" dangerouslySetInnerHTML={{__html: help}}></p>
        </div>
        {checked && countryError &&
          <div className="col-lg-12 mb-2">
            <p className="text-danger">{countryError}</p>
          </div>
        }
      </div>
    )
  }
}

Country.propTypes = {
  name: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  countryError: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  help: PropTypes.string
}

export default Country
