import { useInfiniteQuery, keepPreviousData, useQuery } from '@tanstack/react-query'
import { isNil } from 'lodash'

import DatasetApi from '../api/DatasetApi'

export const useGlossaryQuery = () => {
  return useQuery({
    queryKey: ['glossary'],
    queryFn: () => DatasetApi.fetchGlossary(),
    placeholderData: keepPreviousData
  })
}

export const useIdentifiersQuery = () => {
  return useQuery({
    queryKey: ['identifiers'],
    queryFn: () => DatasetApi.fetchIdentifiers(),
    placeholderData: keepPreviousData
  })
}

export const useDatasetsQuery = (params) => {
  return useInfiniteQuery({
    queryKey: ['datasets', params],
    queryFn: (context) => DatasetApi.fetchDatasets({
      ...params, page: context.pageParam, caveats: true, annotations: true
    }).catch(error => console.log(error)),
    initialPageParam: '1',
    getNextPageParam: (lastPage) => isNil(lastPage.next) ? null : lastPage.next.match(/page=(\d+)/)[1],
  })
}

export const useDatasetSuggestionsQuery = (params) => {
  return useQuery({
    queryKey: ['suggestions', params],
    queryFn: () => DatasetApi.fetchDatasetSuggestions(params)
  })
}

export const useDatasetsHistogramQuery = (identifier, params, enabled) => {
  return useQuery({
    queryKey: ['histogram', identifier, params],
    queryFn: () => DatasetApi.fetchDatasetsHistogram(identifier, params),
    placeholderData: keepPreviousData,
    enabled
  })
}

export const useTreeQuery = (params) => {
  return useQuery({
    queryKey: ['tree', params],
    queryFn: () => DatasetApi.fetchTree(params),
    placeholderData: keepPreviousData
  })
}
