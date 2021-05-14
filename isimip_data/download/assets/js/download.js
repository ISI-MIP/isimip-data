import 'bootstrap'

import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App.js"

const appElement = document.getElementById('app')

if (appElement !== null) {
  if (appElement.dataset.url) {
    ReactDOM.render(<App url={appElement.dataset.url} paths={[]} />, appElement)
  } else {
    ReactDOM.render(<App url={null} paths={Object.values(appElement.dataset)}/>, appElement)
  }
}
