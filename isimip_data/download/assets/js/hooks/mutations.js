import { useMutation, useQueryClient } from '@tanstack/react-query'
import DownloadApi from '../api/DownloadApi'

export const useSubmitJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables) => {
      return DownloadApi.submitJob(variables.url, variables.data, variables.uploads)
    },
    onSuccess: (data, variables) => {
      variables.setJob(data)
    },
    onError: (error, variables) => {
      console.log(error)
      variables.setErrors(error.errors)
    }
  })
}
