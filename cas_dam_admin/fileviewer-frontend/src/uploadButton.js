/*
This button styling came from https://codepen.io/KPCodes/pen/QgKREZ,
this infromation and citation should and can be
moved to a README at a later point.
*/

import React from 'react';
import './uploadButtonStyle.css';
import {API_local_upload, API_gcloud_upload} from "./api.js";

class UploadButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handleBtnClick = () => {
        // TODO: For harrison, look at javascript/react loggging packages
        // console.log(this.props.upload);
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