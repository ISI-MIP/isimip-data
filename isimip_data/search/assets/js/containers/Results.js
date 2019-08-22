import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DatasetApi from '../api/DatasetApi'

import Count from '../components/Count'
import Pagination from '../components/Pagination'
import Result from '../components/Result'


class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      count: 0
    }
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params } = this.props

    DatasetApi.fetchDatasets(params).then(json => {
      this.setState({
        count: json.count,
        results: json.results
      })
    })
  }

  render() {
    const { params, onPaginationClick } = this.props
    const { results, count } = this.state

    return (
      <div className="results">
        <div className="row">
          <div className="col-lg-8">
            <Pagination count={count} page={params.page} pageSize={10} onClick={onPaginationClick} />
          </div>
          <div className="col-lg-4">
            <Count count={count} />
          </div>
        </div>
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
  onPaginationClick: PropTypes.func.isRequired
}

export default Results
