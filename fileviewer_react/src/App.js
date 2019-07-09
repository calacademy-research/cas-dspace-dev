import { APIButton } from './apiButton.js'
import { TreeExample } from './tree.js'
import { Header } from './header.js'
import { ModeButton, ModeSwitch } from './modeButton.js'
import React, { Fragment } from 'react'

function App() {
  return (
    <Fragment>
      <Header />
      <ModeSwitch />
    </Fragment>
  )
}

export default App;
