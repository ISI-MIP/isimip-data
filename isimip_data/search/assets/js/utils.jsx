import React from 'react'
import bytes from 'bytes'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

export const getSize = size => bytes(size, {unitSeparator: ' '})

export const handleDownload = (params) => {
  DatasetApi.fetchDatasets(params).then(response => {
    DatasetApi.downloadFiles(response.results.reduce((acc, cur) => acc.concat(cur.files), []))
  })
}

export const addLineBreaks = (string) => (
  string.split('_').reduce((name, token, index) => (
    (index == 0) ? [<React.Fragment key={index}>{token}</React.Fragment>]
                 : [...name, <React.Fragment key={index}>_<wbr />{token}</React.Fragment>]
  ), [])
)
