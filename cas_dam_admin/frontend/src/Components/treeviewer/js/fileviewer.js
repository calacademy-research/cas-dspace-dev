
/*
This wraps all of the existing components in an app
that can be served to the render to DOM. The React Fragment
method is the preferred method of wrapping components rather
than simply a div.
 */

import {ButtonBar} from './buttonBar.js';
import React, {Fragment} from 'react'

class FileViewer extends React.Component {

    render() {
        return (
            <Fragment>
                <ButtonBar closeModal={this.props.closeModal} setSelection={this.props.setSelection}/>
            </Fragment>
        )
    }
}

export { FileViewer };
