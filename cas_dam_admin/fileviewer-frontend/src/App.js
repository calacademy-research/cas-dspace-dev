import { Header } from './header.js'
import { ButtonBar } from './buttonBar.js'
import React, { Fragment } from 'react'

/*
This wraps all of the existing components in an app
that can be served to the render to DOM. The React Fragment
method is the preferred method of wrapping components rather
than simply a div.
 */

function App() {
  return (
    <Fragment>
        <Header />
        <ButtonBar />
    </Fragment>
  )
}

export default App;
