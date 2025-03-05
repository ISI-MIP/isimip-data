import 'bootstrap'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './components/App.js'

const queryClient = new QueryClient()

const appElement = document.getElementById('app')

createRoot(appElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
