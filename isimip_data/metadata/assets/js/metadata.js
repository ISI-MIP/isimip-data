import 'bootstrap'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Metadata from './components/Metadata.js'

const appElement = document.getElementById('app')

createRoot(appElement).render(<Metadata />)
