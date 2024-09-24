import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'

import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Operation from './Operation'

const Operations = ({ files, values, errors, setValues }) => {

  const { data: settings } = useSettingsQuery()

  const addOperation = (operation) => {
    setValues({
      ...values, operations: [...values.operations, {
        operation: operation.operation,
        ...operation.initial
      }]
    })
  }

  const updateOperation = (operationIndex, operation) => {
    setValues({
      ...values, operations: [...values.operations.map((op, opIndex) => (
        (opIndex == operationIndex) ? operation : op
      ))]
    })
  }

  const removeOperation = (operationIndex) => {
    setValues({
      ...values, operations: [...values.operations.filter((op, opIndex) => opIndex != operationIndex)]
    })
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
        values.operations.map((operation, operationIndex) => (
          <Operation
            key={operationIndex}
            operation={settings.DOWNLOAD_OPERATIONS.find(op => (op.operation == operation.operation))}
            operationIndex={operationIndex}
            operationValues={values.operations[operationIndex]}
            operationErrors={[]}
            updateOperation={updateOperation}
            removeOperation={removeOperation}
          />
        ))
      }
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
    </div>
  )
}

Operations.propTypes = {
  files: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default Operations
