import { useQuery } from '@tanstack/react-query'

import AccessApi from '../api/AccessApi'

export const useAccessQuery = () => {
  return useQuery({
    queryKey: ['access'],
    queryFn: () => AccessApi.fetchAccess()
  })
}
