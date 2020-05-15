import 'bootstrap'

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom'

import App from "./components/App.js"


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById("app"))
