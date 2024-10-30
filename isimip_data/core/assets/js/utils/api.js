export class ValidationError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export const encodeParams = params => {
  return Object.entries(params).map(item => {
    const [key, value] = item

    if (Array.isArray(value)) {
      return value.map(v => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(v)
      }).join('&')
    } else {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  }).join('&')
}

export const getFileName = response => {
  const disposition = response.headers.get('Content-Disposition')

  if (disposition && disposition.indexOf('attachment') !== -1) {
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    let matches = filenameRegex.exec(disposition)
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '')
    }
  } else {
    return response.url.split('/').pop()
  }
}

export const downloadFile = (url) => {
  const a = document.createElement('a')
  a.href = url
  a.click()
  a.remove()
}

export const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  a.remove()
}
