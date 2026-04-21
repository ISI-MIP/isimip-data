import 'bootstrap'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '../scss/caveats.scss'

import Caveats from './components/Caveats'

const queryClient = new QueryClient()

const appElement = document.getElementById('app')

createRoot(appElement).render(
  <QueryClientProvider client={queryClient}>
    <Caveats />
  </QueryClientProvider>
)
