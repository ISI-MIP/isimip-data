import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

const ResultNav = ({ dataset, tab, setTab }) => (
  <nav className="nav nav-underline">
    <button className={classNames('nav-link link', {'active': tab == 'metadata'})}
            onClick={() => setTab('metadata')}>
      Metadata
    </button>
    <button className={classNames('nav-link link', {'active': tab == 'files'})}
            onClick={() => setTab('files')}>
      Files
    </button>
    {
      !isEmpty(dataset.references) && (
        <button className={classNames('nav-link link', {'active': tab == 'references'})}
                onClick={() => setTab('references')}>
          References
        </button>
      )
    }
    {
      !isEmpty(dataset.resources) && (
        <button className={classNames('nav-link link', {'active': tab == 'resources'})}
                onClick={() => setTab('resources')}>
          Citation
        </button>
      )
    }
    {
      (!isEmpty(dataset.caveats) || !isEmpty(dataset.caveats_versions)) && (
        <button className={classNames('nav-link link', {'active': tab == 'caveats'})}
                onClick={() => setTab('caveats')}>
          Issues & Notes
        </button>
      )
    }
    <button className={classNames('nav-link link', {'active': tab == 'downloads'})}
            onClick={() => setTab('downloads')}>
      Downloads
    </button>
  </nav>
)

ResultNav.propTypes = {
  dataset: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
}

export default ResultNav
