import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isNil } from 'lodash'

import DownloadApi from '../api/DownloadApi'

const refetchInterval = 4000

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => DownloadApi.fetchCountries(),
    placeholderData: keepPreviousData
  })
}

export const useJobQuery = (url) => {
  return useQuery({
    queryKey: ['job', url],
    queryFn: () => DownloadApi.fetchJob(url),
    placeholderData: keepPreviousData,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: false,
    enabled: !isNil(url),
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      return (query.state.data && [
        'queued',
        'started',
        'scheduled'
      ].includes(query.state.data.status)) ? refetchInterval : false
    }
  })
}
