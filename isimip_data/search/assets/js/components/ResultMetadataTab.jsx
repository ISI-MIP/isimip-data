import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

import { getSize } from '../utils'

const ResultMetadataTab = ({ dataset }) => {

  const specifiers = dataset.pretty_specifiers

  return (
    <div className="position-relative">
      <div className="position-absolute top-0 end-0">
        <Tooltip title="Visit dataset metadata page.">
          <a className="d-block ms-auto" href={dataset.metadata_url} target="_blank" rel="noreferrer">
            <Icon className="d-block" icon="exit_to_app" />
          </a>
        </Tooltip>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <strong>ISIMIP ID</strong>
        </div>
        <div className="col-lg-8">
          <code>{dataset.id}</code>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <strong>Version</strong>
        </div>
        <div className="col-lg-8">
          {dataset.version}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <strong>Size</strong>
        </div>
        <div className="col-lg-8">
          {getSize(dataset.size)}
        </div>
      </div>
      {
        Object.keys(specifiers).map((key, index) => {
          const values = specifiers[key]

          return (
            <div key={index} className="row">
              <div className="col-lg-4">
                <strong>{key}</strong>
              </div>
              <div className="col-lg-8">
                {values.map((v, i) => <div key={i}>{v}</div>)}
              </div>
            </div>
          )
        })
      }
      <hr className="mt-2 mb-2" />
      <div>
        <strong>Path</strong>
      </div>
      <div>
        {dataset.paths.map((path, index) => <div key={index}><code>{path}</code></div>)}
      </div>
    </div>
  )
}

ResultMetadataTab.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default ResultMetadataTab
