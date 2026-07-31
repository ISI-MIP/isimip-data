import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Errors from './Errors'

const CountryMask = ({ countryMask, errors, onChange }) => {
  const { data: settings } = useSettingsQuery()

  console.log(settings.DOWNLOAD_COUNTRY_MASKS)

  return settings && <>
    <div className="col-lg-4">
      <select
        className={'form-control download-form-input-country-mask mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
        value={countryMask} onChange={event => onChange(event.target.value)}
      >
        <option disabled value="">Choose...</option>
        {
          Object.entries(settings.DOWNLOAD_COUNTRY_MASKS).map(([key, label]) => {
            return <option key={key} value={key}>{label}</option>
          })
        }
      </select>
      <Errors errors={errors} />
    </div>
  </>
}

CountryMask.propTypes = {
  countryMask: PropTypes.string.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default CountryMask
