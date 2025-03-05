import React from 'react'
import PropTypes from 'prop-types'


const ConfigureDownload = ({ files }) => (
  <form className="m-0" method="post" action="/download/" target="_blank">
    {
      files.map(file => <input type="hidden" name="paths" value={file.path} key={file.id} />)
    }
    <button type="submit" className="btn btn-link"
       title="Download only a specific country, a lat/lon box or landonly data.">
      Configure download
    </button>
  </form>
)

ConfigureDownload.propTypes = {
  files: PropTypes.array.isRequired
}

export default ConfigureDownload
