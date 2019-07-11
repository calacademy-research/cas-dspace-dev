
/*
This button styling came from https://codepen.io/KPCodes/pen/QgKREZ,
this infromation and citation should and can be
moved to a README at a later point.
*/

import React from 'react';
import './uploadButtonStyle.css';
import { API_local_upload, API_gcloud_upload} from "./api.js";

class UploadButton extends React.Component {
  constructor(props){
    super(props);
  }

  handleBtnClick = () => {
    console.log(this.props.upload);
    let response;
    if(this.props.upload.uploadType === 'gcloud'){
        response = API_gcloud_upload(this.props.upload);
    } else {
       response = API_local_upload(this.props.upload);
    }
    console.log(response)

  };

  render() {
    return (
        <div className="button-container">
          <button
              className="button"
              onClick={this.handleBtnClick}
              >
            {"Upload File"}
          </button>
        </div>
    )
  }
}

export { UploadButton };