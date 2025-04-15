import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ResultBadges from './ResultBadges'
import ResultCaveatsButton from './ResultCaveatsButton'
import ResultCaveatsTab from './ResultCaveatsTab'
import ResultDownloadsButton from './ResultDownloadsButton'
import ResultDownloadsTab from './ResultDownloadsTab'
import ResultFilesTab from './ResultFilesTab'
import ResultMetadataTab from './ResultMetadataTab'
import ResultNav from './ResultNav'
import ResultReferencesButton from './ResultReferencesButton'
import ResultReferencesTab from './ResultReferencesTab'
import ResultResourcesButton from './ResultResourcesButton'
import ResultResourcesTab from './ResultResourcesTab'
import ResultSelect from './ResultSelect'
import ResultTitle from './ResultTitle'

const Result = ({ dataset, glossary, selected, setSelected }) => {

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('metadata')

  const handleButton = (tabKey) => {
    if (open && (tab == tabKey)) {
      setOpen(false)
    } else {
      setOpen(true)
      setTab(tabKey)
    }
  }

  return (
    <div className="result card mb-1">
      <ul className="list-group list-group-flush position-relative">
        <li className="list-group-item">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-start gap-1 mb-2">
            <ResultTitle
              dataset={dataset}
              glossary={glossary}
              open={open}
              setOpen={setOpen}
            />
            <ResultReferencesButton dataset={dataset} onClick={() => handleButton('references')} />
            <ResultCaveatsButton dataset={dataset} onClick={() => handleButton('caveats')} />
            <ResultResourcesButton dataset={dataset} onClick={() => handleButton('resources')} />
            <ResultDownloadsButton dataset={dataset} onClick={() => handleButton('downloads')} />
          </div>
          <div className="d-flex flex-wrap align-items-center row-gap-1 column-gap-2">
            <ResultSelect dataset={dataset} selected={selected} setSelected={setSelected} />
            <ResultBadges dataset={dataset} glossary={glossary} />
          </div>
        </li>
        {
          open && (
            <li className="list-group-item">
              <ResultNav dataset={dataset} tab={tab} setTab={setTab} />

              <div className="mb-1">
                {tab == 'metadata' && <ResultMetadataTab dataset={dataset} />}
                {tab == 'files' && <ResultFilesTab dataset={dataset} />}
                {tab == 'references' && <ResultReferencesTab dataset={dataset} />}
                {tab == 'resources' && <ResultResourcesTab dataset={dataset} />}
                {tab == 'caveats' && <ResultCaveatsTab dataset={dataset} />}
                {tab == 'downloads' && <ResultDownloadsTab dataset={dataset} setTab={setTab} />}
              </div>
            </li>
          )
        }
      </ul>
    </div>
  )
}

Result.propTypes = {
  dataset: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired
}

export default Result
