import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Errors from './Errors'

const LandSeaMask = ({ landSeaMask, errors, onChange }) => {
  const { data: settings } = useSettingsQuery()

  return settings && <>
    <div className="col-lg-4">
      <select
        className={'form-control download-form-input-land-sea-mask mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
        value={landSeaMask} onChange={event => onChange(event.target.value)}
      >
        <option disabled value="">Choose...</option>
        {
          Object.entries(settings.DOWNLOAD_LAND_SEA_MASKS).map(([key, label]) => {
            return <option key={key} value={key}>{label}</option>
          })
        }
      </select>
      <Errors errors={errors} />
    </div>
  </>
}

LandSeaMask.propTypes = {
  landSeaMask: PropTypes.string.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default LandSeaMask
