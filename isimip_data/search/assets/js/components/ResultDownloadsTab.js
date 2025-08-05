import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'

import { handleDownload } from '../utils'

import ConfigureDownload from './ConfigureDownload'

const ResultDownloadsTab = ({ dataset, setTab }) => {
  return (
    <div>
      {
        dataset.restricted ? (
          <div className="mb-2 mb-md-0 pt-1 pb-1">
            <div className="mb-1">
              Access to this dataset is restricted. To gain access, please use the button
              below and acknowledge the additional terms of use.
            </div>
            <div className="col-lg-3">
              <a className="btn btn-success btn-sm" href={`/access/${dataset.path}`} target="_blank" rel="noreferrer">
                Request access
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="row mb-2 mb-md-0 pt-1 pb-1">
              <div className="col-lg-4">
                <ConfigureDownload label="Configure download" files={dataset.files} />
              </div>
              <div className="col-lg-8 text-muted">
                Run operations on the server to, e.g. cut-out regions or selecting time series.
              </div>
            </div>
            <div className="row mb-2 mb-md-0 pt-1 pb-1">
              <div className="col-lg-4">
                <button type="button" className="d-flex align-items-center link" onClick={() => handleDownload({id: dataset.id})}>
                  <Icon className="me-2" icon="file_copy" /> Download all files
                </button>
              </div>
              <div className="col-lg-8 text-muted">
                Download all files in this dataset at once.
              </div>
            </div>
            <div className="row mb-2 mb-md-0 pt-1 pb-1">
              <div className="col-lg-4">
                <button type="button" className="d-flex align-items-center link" onClick={() => setTab('files')}>
                  <Icon className="me-2" icon="draft" /> Download individual files
                </button>
              </div>
              <div className="col-lg-8 text-muted">
                View the file list to download files one at a time.
              </div>
            </div>
            <div className="row pt-1 pb-1">
              <div className="col-lg-4">
                <a className="d-flex align-items-center" href={dataset.filelist_url}>
                  <Icon className="me-2" icon="description" /> Download file list
                </a>
              </div>
              <div className="col-lg-8 text-muted">
                Download a list of all files in this dataset to be used with, e.g. wget.
              </div>
            </div>

            <div className="text-muted mt-2">
              You can also select multiple datasets and use the download option for the
              selected datasets at the top of the page.
            </div>
          </>
        )
      }
    </div>
  )
}

ResultDownloadsTab.propTypes = {
  dataset: PropTypes.object.isRequired,
  setTab: PropTypes.func.isRequired
}

export default ResultDownloadsTab
