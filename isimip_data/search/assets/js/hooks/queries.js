import { useQuery } from '@tanstack/react-query'

import FacetApi from '../api/FacetApi'

export const useFacetsQuery = () => {
  return useQuery({
    queryKey: ['facets'],
    queryFn: () => FacetApi.fetchFacets()
  })
}
