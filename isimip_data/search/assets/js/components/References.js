import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

const referenceTypes = ['OTHER', 'EVALUATION', 'ISIPEDIA']

class References extends Component {

  render() {
    const { dataset } = this.props

    const referenceTypeIndex = dataset.annotations.reduce((acc, cur) => {
        const index = cur.references.reduce((a, c) => {
            const i = referenceTypes.indexOf(c.reference_type)
            return (i > a) ? i : a
        }, -1)
        return (index > acc) ? index : acc
    }, -1)

    const referenceType = referenceTypes[referenceTypeIndex]
    if (referenceType == 'ISIPEDIA') {
      return (
        <OverlayTrigger placement="bottom" overlay={
          <Tooltip>
            There are articles on ISIpedia available for this dataset.
          </Tooltip>
        }>
          <a className="float-right result-reference" href={`${dataset.metadata_url}#references`} target="_blank">
            <img className="isipedia-logo" src="/static/images/isipedia.png" alt="ISIpedia logo" />
          </a>
        </OverlayTrigger>
      )
    } else if (referenceType == 'EVALUATION') {
      return (
        <OverlayTrigger placement="bottom" overlay={
          <Tooltip>
            There are evaluation articles available for this dataset.
          </Tooltip>
        }>
          <a className="float-right result-reference" href={`${dataset.metadata_url}#references`} target="_blank">
            <FontAwesomeIcon className="result-icon" icon={faCheckCircle} />
          </a>
        </OverlayTrigger>
      )
    } else if (referenceType == 'OTHER') {
      return (
        <OverlayTrigger placement="bottom" overlay={
          <Tooltip>
            There are references to other publications for this dataset.
          </Tooltip>
        }>
          <a className="float-right result-reference" href={`${dataset.metadata_url}#references`} target="_blank">
            <FontAwesomeIcon className="result-icon" icon={faExternalLinkAlt} />
          </a>
        </OverlayTrigger>
      )
    } else {
      return null
    }
  }
}

References.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default References
