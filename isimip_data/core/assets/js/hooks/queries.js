import { keepPreviousData, useQuery } from '@tanstack/react-query'

import CoreApi from '../api/CoreApi'

// const refetchInterval = 4000

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => CoreApi.fetchSettings(),
    placeholderData: keepPreviousData
  })
}
