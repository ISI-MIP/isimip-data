import React from 'react'
import PropTypes from 'prop-types'

import { useLs } from 'isimip_data/core/assets/js/hooks/ls'

import Facets from './Facets'
import Tree from './Tree'


const Sidebar = ({ params, glossary, updateParams }) => {

  const [sidebar, setSidebar] = useLs('isimip.search.sidebar', 'tree')

  return <>
    <div className="card">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="d-flex flex-wrap column-gap-3">
            Sidebar View:
            <div className="form-check form-check-inline me-0">
              <input className="form-check-input" type="radio" id="tree-radio"
                     onChange={() => setSidebar('tree')} checked={sidebar == 'tree'} />
              <label className="form-check-label" htmlFor="tree-radio">Tree</label>
            </div>
            <div className="form-check form-check-inline me-0">
              <input className="form-check-input" type="radio" id="facets-radio"
                     onChange={() => setSidebar('facets')} checked={sidebar == 'facets'} />
              <label className="form-check-label" htmlFor="facets-radio">Facets</label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    {
      (sidebar == 'tree') && <Tree params={params} glossary={glossary} updateParams={updateParams} />
    }
    {
      (sidebar == 'facets') && <Facets params={params} glossary={glossary} updateParams={updateParams}/>
    }
  </>
}


Sidebar.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Sidebar
