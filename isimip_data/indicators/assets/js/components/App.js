import React, { Component} from 'react'
import PropTypes from 'prop-types'

import Scale from './Scale'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      order: this.props.table.reverse ? 'value' : '-value'
    }
  }

  handleTableSort(e, newOrder) {
    e.preventDefault()
    this.setState({ order: (this.state.order == newOrder ? '-' : '') + newOrder })
  }

  sortTable(table, order) {
    let sortedRows = [...table.rows]

    if (order) {
      const orderIdentifier = order.startsWith('-') ? order.substring(1) : order
      const orderReverse = order.startsWith('-')

      sortedRows.sort((a, b) => {
        let aValue, bValue
        if (orderIdentifier == 'value') {
          aValue = a.value
          bValue = b.value
        } else {
          aValue = a.specifiers[orderIdentifier].join('|')
          bValue = b.specifiers[orderIdentifier].join('|')
        }

        if (aValue < bValue) {
          return orderReverse ? 1 : -1
        }
        if (aValue > bValue) {
          return orderReverse ? -1 : 1
        }
        return 0
      })
    }
    return sortedRows
  }

  renderChevrons(order, identifier) {
    let direction = 0
    if (order && order.endsWith(identifier)) {
      direction = order.startsWith('-') ? 1 : -1
    }

    return (
      <span className="text-muted">
        {
          direction == 1 &&
          <span className="material-symbols-rounded symbols-expand">expand_less</span>
        }
        {
          direction == -1 &&
          <span className="material-symbols-rounded symbols-expand">expand_more</span>
        }
        {
          direction == 0 &&
          <span className="material-symbols-rounded symbols-expand" style={{opacity: 0.2}}>expand_more</span>
        }
      </span>
    )
  }

  render() {
    const { table } = this.props
    const { order } = this.state

    return (
      <table className="table small">
        <thead>
          <tr>
            {
              table.identifiers.map((identifier, index) => (
                <th key={index}>
                  <a href="#" className="text-body" onClick={e => this.handleTableSort(e, identifier)}>
                    <span>{table.pretty_identifiers[index]}</span>
                    {' '}
                    {this.renderChevrons(order, identifier)}
                  </a>
                </th>
              ))
            }
            <th>
              <a href="#" className="text-body" onClick={e => this.handleTableSort(e, 'value')}>
                <span>Value</span>
                {' '}
                {this.renderChevrons(order, 'value')}
              </a>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            this.sortTable(table, order).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {
                  Object.entries(row.pretty_specifiers).map(([identifier, specifiers], index) => (
                    <td key={index}>{specifiers.join('|')}</td>
                  ))
                }
                <td style={{paddingTop: 0, paddingBottom: 0, width: 150}}>
                  <Scale value={row.value} minimum={table.minimum} maximum={table.maximum} />
                </td>
                <td>
                  <a href="{row.search_url}" target="_blank">Search</a>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}

export default App
