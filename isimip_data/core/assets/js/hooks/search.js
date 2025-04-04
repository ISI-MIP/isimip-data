import { useMemo } from 'react'
import MiniSearch from 'minisearch'
import { isEmpty } from 'lodash'

export const useSearch = (items, options) => {

  const index = useMemo(() => {
    const searchIndex = new MiniSearch(options)
    searchIndex.addAll(items)
    return searchIndex
  }, [items])

  const search = (string) => isEmpty(string) ? items : (
    index.search(string, { prefix: true }).map((result) => items.find(item => item.id == result.id))
  )

  return { index, search }
}
