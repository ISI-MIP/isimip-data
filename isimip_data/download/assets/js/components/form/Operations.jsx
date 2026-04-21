import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { isEmpty, isUndefined, last } from 'lodash'

import Operation from './Operation'

const Operations = ({ operationsConfig, operationsHelp, operations, errors, setOperations }) => {

  const [disabled, setDisabled] = useState(false)

  const lastOperation = last(operations)
  const lastOperationConfig = operationsConfig.find(operation => (
    lastOperation && (operation.operation == lastOperation.operation)
  ))

  const disabledOperations = operationsConfig.filter(operation => (
    lastOperationConfig && (
      isUndefined(lastOperationConfig.next) ||
      isEmpty(lastOperationConfig.next) ||
      !lastOperationConfig.next.includes(operation.operation)
    )
  )).map(operation => operation.operation)

  useEffect(() => {
    setDisabled(
      lastOperation && (
        lastOperation.compute_mean || lastOperation.output_csv || (
          disabledOperations.length == operationsConfig.length
        )
      )
    )
  }, [lastOperation, disabledOperations, operationsConfig])

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
    if (disabledOperations.length == operationsConfig.length) {
      return <div className="ms-3">No operations can be added after this operation.</div>
    } else if (lastOperation && lastOperation.output_csv) {
      return <div className="ms-3">No operations can be added after creating a CSV file.</div>
    } else if (lastOperation && lastOperation.compute_mean) {
      return <div className="ms-3">No operations can be added after computing the mean field.</div>
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
              errors={errors}
              updateOperation={updateOperation}
              removeOperation={removeOperation}
            />
          )
        })
      }

      <div className="d-flex align-items-center">
        <div className="dropdown">
          <button
            type="button" className="btn btn-success dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false"
            disabled={disabled}
          >
            Add operation
          </button>
          <div className="dropdown-menu">
            {
              !isEmpty(disabledOperations) && (
                <p className="dropdown-header pt-0 text-secondary">
                  <small>
                    Some operations are deactivated because they are incompatible or
                    senseless in relation to the last operation selected.
                  </small>
                </p>
              )
            }
            {
              operationsConfig.map(operation => (
                <button key={operation.operation} className="dropdown-item" type="button"
                        disabled={disabledOperations.includes(operation.operation)}
                        onClick={() => addOperation(operation)}>
                  <small>
                    <Markdown className="mb-0">{operation.label}</Markdown>
                  </small>
                </button>
              ))
            }
          </div>
        </div>
        {
          renderLastOperationMessage()
        }
        <button type="button" className="btn btn-danger ms-auto" onClick={() => setOperations([])}>
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
