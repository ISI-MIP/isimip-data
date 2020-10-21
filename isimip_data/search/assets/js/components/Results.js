import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ls from 'local-storage'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Count from './Count'
import Pagination from './Pagination'
import Params from './Params'
import Result from './Result'
import Selection from './Selection'


class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      count: 0,
      selected: []
    }
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSelectionReset = this.handleSelectionReset.bind(this)
    this.getIndex = this.getIndex.bind(this)
    this.isSelected = this.isSelected.bind(this)
  }

  componentDidMount() {
    this.fetchSelected()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params } = this.props

    this.setState({ isLoading: true, results: [] })
    DatasetApi.fetchDatasets(params).then(data => {
      this.setState({
        isLoading: false,
        count: data.count,
        results: data.results
      })
    })
  }

  handlePaginationClick(page) {
    const { onPaginationClick } = this.props
    const { isLoading } = this.state

    if (!isLoading) {
      onPaginationClick(page)
    }
  }

  handleSelection(e, dataset) {
    const { selected } = this.state

    const index = this.getIndex(dataset)
    if (index === false) {
      selected.push(dataset)
    } else {
      selected.splice(index, 1);
    }

    this.setState({ selected }, this.storeSelected)
  }

  handleSelectionReset(e) {
    e.preventDefault()
    this.setState({ selected: [] }, this.storeSelected)
  }

  fetchSelected() {
    const selected = JSON.parse(ls.get('selected'))
    if (selected !== null) {
      this.setState({ selected })
    }
  }

  storeSelected() {
    const { selected } = this.state
    ls.set('selected', JSON.stringify(selected))
  }

  getIndex(dataset) {
    const { selected } = this.state

    return selected.reduce((accumulator, currentDataset, currentIndex) => {
      if (accumulator == false && dataset.id == currentDataset.id) {
        return currentIndex
      } else {
        return accumulator
      }
    }, false)
  }

  isSelected(dataset) {
    return this.getIndex(dataset) !== false
  }

  render() {
    const { params, pageSize, glossary, onVersionChange, onParamsRemove, onPaginationClick } = this.props
    const { page } = params
    const { isLoading, results, count, selected } = this.state

    return (
      <div className="results">
        <div className="row">
          <div className="col-lg-4">
            <Count count={count} isLoading={isLoading} />
          </div>
          <div className="col-lg-8">
            {page && <Pagination count={count} page={page} pageSize={pageSize}
                                 onClick={this.handlePaginationClick} />}
          </div>
        </div>
        <Selection selected={selected} onReset={this.handleSelectionReset} />
        <Params params={params} onRemove={onParamsRemove} />
        {
          results.map(dataset => {
            return <Result key={dataset.id} dataset={dataset} glossary={glossary}
                           onSelect={this.handleSelection} isSelected={this.isSelected} />
          })
        }
      </div>
    )
  }
}

Results.propTypes = {
  params: PropTypes.object.isRequired,
  pageSize: PropTypes.number.isRequired,
  glossary: PropTypes.object.isRequired,
  onParamsRemove: PropTypes.func.isRequired,
  onPaginationClick: PropTypes.func.isRequired
}

export default Results
