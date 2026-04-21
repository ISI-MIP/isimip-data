/* eslint-disable no-unused-vars */
import { Tooltip } from 'bootstrap'

import '../scss/bootstrap.scss'

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
