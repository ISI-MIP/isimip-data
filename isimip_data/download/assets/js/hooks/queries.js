import { keepPreviousData, useQuery } from '@tanstack/react-query'

import DownloadApi from '../api/DownloadApi'

// const refetchInterval = 4000

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => DownloadApi.fetchCountries(),
    placeholderData: keepPreviousData
  })
}
