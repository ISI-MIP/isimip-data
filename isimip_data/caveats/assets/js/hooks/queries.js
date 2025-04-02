import { keepPreviousData, useQuery } from '@tanstack/react-query'

import CaveatsApi from '../api/CaveatsApi'

export const useCaveatsQuery = () => {
  return useQuery({
    queryKey: ['caveats'],
    queryFn: () => CaveatsApi.fetchCaveats({}).catch(error => console.error(error)),
    initialData: [],
    placeholderData: keepPreviousData
  })
}

export const useCategoryQuery = () => {
  return useQuery({
    queryKey: ['category'],
    queryFn: () => CaveatsApi.fetchCategory({}).catch(error => console.error(error)),
    initialData: [],
    placeholderData: keepPreviousData
  })
}

export const useSeverityQuery = () => {
  return useQuery({
    queryKey: ['severity'],
    queryFn: () => CaveatsApi.fetchSeverity({}).catch(error => console.error(error)),
    initialData: [],
    placeholderData: keepPreviousData
  })
}

export const useStatusQuery = () => {
  return useQuery({
    queryKey: ['status'],
    queryFn: () => CaveatsApi.fetchStatus({}).catch(error => console.error(error)),
    initialData: [],
    placeholderData: keepPreviousData
  })
}
