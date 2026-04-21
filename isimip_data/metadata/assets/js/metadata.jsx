import 'bootstrap'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Metadata from './components/Metadata'

const appElement = document.getElementById('app')

createRoot(appElement).render(<Metadata />)
