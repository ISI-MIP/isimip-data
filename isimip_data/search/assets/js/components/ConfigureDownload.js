import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ConfigureDownload = ({ label, title, files }) => (
  <form className="d-flex align-items-center m-0" method="post" action="/download/" target="_blank">
    {
      files.map(file => <input type="hidden" name="paths" value={file.path} key={file.id} />)
    }
    <Tooltip title={title}>
      <button type="submit" className="d-flex align-items-center gap-2 link">
        <Icon icon="edit_document" /> {label}
      </button>
    </Tooltip>
  </form>
)

ConfigureDownload.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  files: PropTypes.array.isRequired
}

export default ConfigureDownload
