import 'bootstrap'

import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App.js"

const appElement = document.getElementById('app')

if (appElement !== null) {
  if (appElement.dataset.url) {
    ReactDOM.render(<App url={appElement.dataset.url} files={[]} />, appElement)
  } else {
    const files = JSON.parse(document.getElementById('files').textContent)
    ReactDOM.render(<App url={null} files={files}/>, appElement)
  }
}
