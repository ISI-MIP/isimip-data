import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { isEmpty } from 'lodash'

import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Operation from './Operation'

const Operations = ({ files, errors, operations, setOperations }) => {

  const { data: settings } = useSettingsQuery()

  const addOperation = (operation) => {
    setOperations([
      ...operations, { operation: operation.operation, ...operation.initial }
    ])
  }

  const updateOperation = (operationIndex, operation) => {
    setOperations([
      ...operations.map((op, opIndex) => ((opIndex == operationIndex) ? operation : op))
    ])
  }

  const removeOperation = (operationIndex) => {
    setOperations([
      ...operations.filter((op, opIndex) => opIndex != operationIndex)
    ])
  }

  return settings && (
    <div>
      <h3>Operations</h3>
      <div className="card mb-2">
        <div className="card-body">
          <Markdown>{settings.DOWNLOAD_OPERATIONS_HELP}</Markdown>
        </div>
      </div>
      {
        isEmpty(operations) || operations.map((values, index) => (
          <Operation
            key={index}
            operation={settings.DOWNLOAD_OPERATIONS.find(op => (op.operation == values.operation))}
            index={index}
            values={values}
            errors={[]}
            updateOperation={updateOperation}
            removeOperation={removeOperation}
          />
        ))
      }
      <div className="d-flex">
        <div className="dropdown dropdown-operations">
          <button className="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
            Add operation
          </button>
          <div className="dropdown-menu">
            {
              settings && settings.DOWNLOAD_OPERATIONS.map(operation => (
                <button key={operation.operation} className="dropdown-item" type="button"
                        onClick={() => addOperation(operation)}>
                  <small>
                    <Markdown>{operation.label}</Markdown>
                  </small>
                </button>
              ))
            }
          </div>
        </div>
        <button className="btn btn-danger ml-auto" onClick={() => setOperations([])}>
          Reset
        </button>
      </div>
    </div>
  )
}

Operations.propTypes = {
  files: PropTypes.array.isRequired,
  errors: PropTypes.object,
  operations: PropTypes.array,
  setOperations: PropTypes.func.isRequired
}

export default Operations
