import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from './Form'
import Job from './Job'

const App = ({ jobUrl: initialJobUrl, files }) => {
  const [jobUrl, setJobUrl] = useState(initialJobUrl)

  const setJob = (job) => {
    history.pushState(null, null, `/download/${job.id}/`)
    setJobUrl(job.job_url)
  }

  if (jobUrl) {
    return <Job jobUrl={jobUrl} />
  } else if (files) {
    return <Form files={files} setJob={setJob}/>
  } else {
    return null
  }
}

App.propTypes = {
  jobUrl: PropTypes.string,
  files: PropTypes.array
}

export default App
