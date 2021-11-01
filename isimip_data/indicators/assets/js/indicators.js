import 'bootstrap'

import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App.js"

const table = JSON.parse(document.getElementById('table').textContent);
ReactDOM.render(<App table={table} />, document.getElementById('app'))
