/*
This button styling came from https://codepen.io/KPCodes/pen/QgKREZ,
this infromation and citation should and can be
moved to a README at a later point.
*/

import React from 'react';
import '../css/uploadButtonStyle.css';
import Logger from './logger.js';
class UploadButton extends React.Component {

    handleBtnClick = () => {
        let path, source;

        if (this.props.upload.uploadType === 'gcloud') {
            path = '';
            source = 'gdrive';
        } else {
            path = this.props.upload.upload;
            source = 'slevin';
        }

        let selection = {
            path: path,
            source: source,
        };

        this.props.setSelection(selection);
        this.props.closeModal();
        Logger.info("Modal Closed");
    };

    render() {
        return (
            <div className="button-container">
                <button
                    className="button"
                    onClick={this.handleBtnClick}
                >
                    {"Select Root Folder"}
                </button>
            </div>
        )
    }
}

export {UploadButton};