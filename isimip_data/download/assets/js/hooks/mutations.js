import { useMutation } from '@tanstack/react-query'
import DownloadApi from '../api/DownloadApi'

export const useSubmitJobMutation = () => {
  return useMutation({
    mutationFn: (variables) => {
      return DownloadApi.submitJob(variables.url, variables.data, variables.uploads)
    },
    onSuccess: (data, variables) => {
      variables.setJob(data)
    },
    onError: (error, variables) => {
      console.error(error)
      variables.setErrors(error.errors || {
        non_field_errors: ['An unknown error occured. Please contact support if this problem persists.']
      })
    }
  })
}
