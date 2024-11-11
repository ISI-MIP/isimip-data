import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { isEmpty, isUndefined, last } from 'lodash'

import Operation from './Operation'

const Operations = ({ operationsConfig, operationsHelp, operations, errors, setOperations }) => {

  const lastOperation = last(operations)

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

  const renderLastOperationMessage = () => {
    if (lastOperation && lastOperation.is_last) {
      return <div className="ml-3">No operations can be added after this operation.</div>
    } else if (lastOperation && lastOperation.output_csv) {
      return <div className="ml-3">No operations can be added after creating a CSV file.</div>
    } else if (lastOperation && lastOperation.compute_mean) {
      return <div className="ml-3">No operations can be added after computing the mean field.</div>
    } else {
      return null
    }
  }

  return (
    <div>
      <h3>Operations</h3>
      <div className="card mb-2">
        <div className="card-body">
          <Markdown>{operationsHelp}</Markdown>
          {
            !isEmpty(errors.operations) && (
              <ul className="list-unstyled text-danger mb-0">
                {
                  errors.operations.map((error, errorIndex) => <li key={errorIndex}>{error}</li>)
                }
              </ul>
            )
          }
        </div>
      </div>
      {
        isEmpty(operations) || operations.map((values, index) => {
          const operation = operationsConfig.find(op => (op.operation == values.operation))

          return operation && (
            <Operation
              key={index}
              operation={operation}
              index={index}
              isLast={index == operations.length - 1}
              values={values}
              errors={[]}
              updateOperation={updateOperation}
              removeOperation={removeOperation}
            />
          )
        })
      }
      <div className="d-flex align-items-center">
        <div className="dropdown dropdown-operations">
          <button
            type="button"
            className="btn btn-success dropdown-toggle"
            disabled={lastOperation && (
              lastOperation.compute_mean || lastOperation.output_csv || lastOperation.is_last
            )}
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Add operation
          </button>
          <div className="dropdown-menu">
            {
              operationsConfig.map(operation => (
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
        {
          renderLastOperationMessage()
        }
        <button type="button" className="btn btn-danger ml-auto" onClick={() => setOperations([])}>
          Reset
        </button>
      </div>
    </div>
  )
}

Operations.propTypes = {
  operationsConfig: PropTypes.array,
  operationsHelp: PropTypes.string,
  operations: PropTypes.array,
  errors: PropTypes.object,
  setOperations: PropTypes.func.isRequired
}

export default Operations
