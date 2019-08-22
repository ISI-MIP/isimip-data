import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Result extends Component {

  constructor(props) {
    super(props);
  }

  renderAttributes(dataset) {
    return (
      <li class="list-group-item">
        <h4 className="card-title">Attributes</h4>
        {
          Object.entries(dataset.attributes).map(([key, value]) => {
            return (
              <div key={key} className="row">
                <div className="col-lg-3">
                  <strong>{key}</strong>
                </div>
                <div className="col-lg-9">
                  {value}
                </div>
              </div>
            )
          })
        }
      </li>
    )
  }

  // renderFiles(dataset) {
  //   return (
  //     <li class="list-group-item">
  //       <h4 className="card-title">Files</h4>
  //       {
  //         Object.entries(dataset.files).map(([key, value], index) => {
  //           return <span key={index}></span>
  //         })
  //       }
  //     </li>
  //   )
  // }

  render() {
    const { dataset } = this.props

    return (
      <div className="card result">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h4 className="card-title">{dataset.name}</h4>
            <p className="card-text">Version: {dataset.version}</p>
          </li>
          {this.renderAttributes(dataset)}
          
        </ul>
      </div>
    )
  }
}

Result.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default Result
