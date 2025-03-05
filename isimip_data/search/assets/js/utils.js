import bytes from 'bytes'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

export const getSize = size => bytes(size, {unitSeparator: ' '})

export const handleDownload = (params) => {
  DatasetApi.fetchDatasets(params).then(response => {
    DatasetApi.downloadFiles(response.results.reduce((acc, cur) => acc.concat(cur.files), []))
  })
}
