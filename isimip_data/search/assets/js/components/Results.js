import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Params from './Params'
import Result from './Result'
import Selection from './Selection'
import LoadMore from './LoadMore'


class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loadMore: false,
      results: [],
      selected: [],
      count: 0,
    }
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSelectionReset = this.handleSelectionReset.bind(this)
    this.getIndex = this.getIndex.bind(this)
    this.isSelected = this.isSelected.bind(this)
  }

  componentDidMount() {
    this.fetchSelected()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params || this.props.pageSize !== prevProps.pageSize) {
      if (!Number.isNaN(this.props.pageSize)) {
        this.fetch()
      }
    }
  }

  fetch() {
    const params = Object.assign({}, this.props.params)

    // reset results the results for the first page
    if (params.page == 1) {
      this.setState({ isLoading: true, results: [] })
    } else {
      this.setState({ isLoading: true })
    }

    // increase the page_size, if page is set, but no results are present
    if (params.page > 1 && this.state.results.length == 0) {
      params.page_size = this.props.pageSize * params.page
      params.page = 1
    }

    DatasetApi.fetchDatasets(params).then(data => {
      this.setState({
        isLoading: false,
        loadMore: data.next ? true: false,
        count: data.count,
        results: this.state.results.concat(data.results)
      })
    })
  }

  handleLoadMore() {
    const { onLoadMore } = this.props
    const { isLoading } = this.state

    if (!isLoading) {
      onLoadMore()
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
    const { params, glossary, onVersionChange, onParamsRemove } = this.props
    const { isLoading, loadMore, results, selected, count } = this.state

    return (
      <div className="results">
        <Selection selected={selected} count={count} isLoading={isLoading} onReset={this.handleSelectionReset} />
        <Params params={params} count={count} onRemove={onParamsRemove} />
        {
          results.map(dataset => {
            return <Result key={dataset.id} dataset={dataset} glossary={glossary}
                           onSelect={this.handleSelection} isSelected={this.isSelected} />
          })
        }
        {loadMore && <LoadMore onLoadMore={this.handleLoadMore} isLoading={isLoading} />}
      </div>
    )
  }
}

Results.propTypes = {
  params: PropTypes.object.isRequired,
  pageSize: PropTypes.number.isRequired,
  glossary: PropTypes.object.isRequired,
  onParamsRemove: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
}

export default Results
