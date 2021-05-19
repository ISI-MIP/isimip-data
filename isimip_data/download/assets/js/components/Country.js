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
    this.props.onSelect('country')
    this.props.onChange(e.target.value)
  }

  render() {
    const { selected, country, countryError, onSelect, help } = this.props
    const { error, countries } = this.state

    return (
      <div className="row download-row align-items-center">
        <div className="col-md-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" className="form-check-input"
                type="radio" name="country" id="check-country"
                onChange={() => onSelect('country')} checked={selected == 'country'} />

            <label className="form-check-label" htmlFor="check-country">Mask by country</label>
          </div>
        </div>
        <div className="col-md-8 mb-2">
          <select className={'form-control download-form-input-country ' + (countryError && 'is-invalid')}
              value={country} onChange={this.handleChange}>

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
        {countryError &&
          <div className="col-lg-12 mb-2">
            <p className="text-danger">{countryError}</p>
          </div>
        }
      </div>
    )
  }
}

Country.propTypes = {
  selected: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  countryError: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default Country
