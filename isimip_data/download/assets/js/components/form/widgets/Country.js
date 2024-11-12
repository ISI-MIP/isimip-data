import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

import { useCountriesQuery } from '../../../hooks/queries'

import Errors from './Errors'

const Country = ({ country, errors, onChange }) => {
  const { data: countries } = useCountriesQuery()

  const countryId = uniqueId('download-form-input-country-')

  return countries && <>
    <div className="col-lg-4">
      <select className={'form-control download-form-input-country mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
              value={country} onChange={event => onChange(event.target.value)}>
        <option disabled value="">Choose...</option>
        {
          countries.map(country => {
            return <option key={country.key} value={country.key}>{country.long_name}</option>
          })
        }
      </select>
      <Errors errors={errors} />
    </div>
  </>
}

Country.propTypes = {
  country: PropTypes.string.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Country
