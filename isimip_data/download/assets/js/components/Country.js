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
    const { selected, country, onSelect } = this.props
    const { error, countries } = this.state

    return (
      <div>
        <div className="download-form-row form-check form-check-inline">
          <input className="form-check-input" type="radio" name="country" id="check-country"
              onChange={() => onSelect('country')} checked={selected == 'country'} />

          <label className="form-check-label" htmlFor="check-country">Mask by country</label>

          <select className="form-control download-form-input-country"
              value={country} onChange={this.handleChange}>

            <option disabled value="">Choose...</option>
            {
              countries.map(item => {
                return <option key={item.key} value={item.key}>{item.long_name}</option>
              })
            }
          </select>
        </div>
      </div>
    )
  }
}

Country.propTypes = {
  selected: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default Country
