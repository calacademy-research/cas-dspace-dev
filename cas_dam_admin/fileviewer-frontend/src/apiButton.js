import React from "react";
import { API_gcloud_children } from './api.js'

/*
Deprecated Component used for testing API calls to the backend.
Can be reformatted to test calls to other endpoints as well.
 */

const buttonStyle = {
  paddingLeft: "0%"
};

class APIButton extends React.Component {

  render() {
      return (
      <div>
      <button type="button" onClick={this.onClick} style={buttonStyle}>Test API Call</button>
      </div>
      );
  }

  onClick() {
    console.log(API_gcloud_children())
  }


}

export { APIButton };
