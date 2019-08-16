import React, { Component } from 'react'
import PropTypes from 'prop-types'


const range = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

class Pagination extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, page) {
    e.preventDefault()
    this.props.onSubmit(page)
  }

  render() {
    const { count, page, pageSize, onSubmit } = this.props
    const pageCount = Math.ceil(count / pageSize)

    const startPage = Math.max(1, Math.min(page - 4, pageCount - 8))
    const endPage = Math.min(Math.max(page + 4, 9), pageCount)

    const pages = range(startPage, endPage)
    const items = pages.map(currentPage => {
      return (
        <li className={'page-item' + ((currentPage == page) ? ' active' : '')} key={currentPage}>
          <a className="page-link" href=""
              onClick={e => this.handleClick(e, currentPage)}>
            {currentPage}
          </a>
        </li>
      )
    })

    return (
      <nav>
        <ul className="pagination">
          <li className={'page-item' + ((page == startPage) ? ' disabled' : '')}>
            <a className="page-link" href="" onClick={e => this.handleClick(e, page - 1)}>
              Previous
            </a>
          </li>
          {items}
          <li className={'page-item' + ((page == endPage) ? ' disabled' : '')}>
            <a className="page-link" href="" onClick={e => this.handleClick(e, page + 1)}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default Pagination
