import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Params from './Params'
import Count from './Count'
import Pagination from './Pagination'
import Result from './Result'


class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      count: 0
    }
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
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

  render() {
    const { params, onParamsRemove, onPaginationClick } = this.props
    const { page } = params
    const { isLoading, results, count } = this.state

    return (
      <div className="results">
        <div className="row">
          <div className="col-lg-4">
            <Count count={count} isLoading={isLoading} />
          </div>
          <div className="col-lg-8">
            {page && <Pagination count={count} page={page} pageSize={10}
                                 onClick={this.handlePaginationClick} />}
          </div>
        </div>
        <Params params={params} onRemove={onParamsRemove} />
        {
          results.map(dataset => {
            return <Result key={dataset.id} dataset={dataset} />
          })
        }
      </div>
    )
  }
}

Results.propTypes = {
  params: PropTypes.object.isRequired,
  onParamsRemove: PropTypes.func.isRequired,
  onPaginationClick: PropTypes.func.isRequired
}

export default Results
