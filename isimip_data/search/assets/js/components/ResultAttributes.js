import React from 'react'
import PropTypes from 'prop-types'

import { getSize } from '../utils'


const ResultAttributes = ({ dataset }) => {

  const specifiers = dataset.pretty_specifiers

  return (
    <li className="list-group-item">
      <div>
        <strong>Path</strong>
      </div>
      <div>
        {dataset.paths.map((path, index) => <div key={index}><code>{path}</code></div>)}
      </div>
      <hr className="mt-2 mb-2" />
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
    </li>
  )
}

ResultAttributes.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default ResultAttributes
