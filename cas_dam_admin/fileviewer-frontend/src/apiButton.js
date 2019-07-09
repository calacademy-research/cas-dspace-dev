import React from "react";
//import axios from "axios";
import { API_gcloud_children, APIcall, APIcallget } from './api.js'
const buttonStyle = {
  paddingLeft: "0%"
}

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
