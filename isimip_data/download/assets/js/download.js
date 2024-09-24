import 'bootstrap'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Form from './components/Form.js'
import Job from './components/Job.js'

const appElement = document.getElementById('app')
const queryClient = new QueryClient()

if (appElement.dataset.url) {
  createRoot(appElement).render(
    <QueryClientProvider client={queryClient}>
      <Job url={appElement.dataset.url} />
    </QueryClientProvider>
  )
} else {
  const files = JSON.parse(document.getElementById('files').textContent)
  createRoot(appElement).render(
    <QueryClientProvider client={queryClient}>
      <Form files={files} />
    </QueryClientProvider>
  )
}
