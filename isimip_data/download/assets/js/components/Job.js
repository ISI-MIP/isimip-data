import React from 'react'
import PropTypes from 'prop-types'

import { useJobQuery } from '../hooks/queries'

const Job = ({ jobUrl }) => {
  const { data: job } = useJobQuery(jobUrl)

  return job && (
    <div>
      <h3>Download status</h3>
      <div className="card">
        <div className="card-body">
          {
            job.status == 'queued' &&
            <p className="text-success">
              <span className="material-symbols-rounded symbols-spin">progress_activity</span>
              The download has been queued on the server.
            </p>
          }
          {
            job.status == 'started' &&
            <p className="text-success">
              <span className="material-symbols-rounded symbols-spin">progress_activity</span>
              The files are created on the server ({job.meta.created_files} of {job.meta.total_files} created).
            </p>
          }
          {
            job.status == 'finished' &&
            <>
              <p className="text-success">
                The files were successfully created on the server, the download should start now.
              </p>
              <p>
                Alternatively, you can use the following link:
                {' '}
                <a href={job.file_url} target="_blank" rel="noreferrer">{job.file_url}</a>.
              </p>
            </>
          }
          {
            job.status == 'failed' && <>
              <p className="text-danger">
                An error occurred while creating the files on the server!
              </p>
              {
                job.meta.error && <>
                  <p className="mb-1">
                    The following error message was provided:
                  </p>
                  <p className="text-info">
                    {job.meta.error}
                  </p>
                </>
              }
              {
                job.meta.errorMessage && <>
                  <p className="mb-1">
                    The following output from the process was provided as well:
                  </p>
                  <p className="text-info">
                    {job.meta.errorMessage}
                  </p>
                </>
              }
              {
                (job.meta.error || job.meta.errorMessage) ? (
                  <p>
                    This could be due to the values you have entered, so please check your entries again.
                  </p>
                ) : (
                  <p>
                    No error message was returned by the server. This usually means that the timeout
                    configured on the server has been reached. You can try again with fewer files selected.
                  </p>
                )
              }
              <p>
                If the problem persists, please contact support.
              </p>
            </>
          }
          {
            job.id && job.status != 'failed' && <>
              <p>
                If you need to close the browser, you can bookmark this page or store its URL otherwise:
                {' '}
                <a href={document.location.toString()} target="_blank" rel="noreferrer">
                  {document.location.toString()}
                </a>.
              </p>
              <p>
                After completion, the files will be stored on the server for {job.ttl/60.0/60.0} hours.
              </p>
            </>
          }
          {
            !job.id &&
            <p className="text-danger">
              The download was not found. Probably it was deleted automatically after some time.
            </p>
          }
        </div>
      </div>
    </div>
  )
}

Job.propTypes = {
  jobUrl: PropTypes.string.isRequired
}

export default Job
