import React, { Fragment } from "react";
import { TreeExample } from './tree.js';
import { ModeSwitch } from "./modeSwitch.js";
import { UploadButton } from "./uploadButton.js";

const labelStyle = {
  color: "#E2C089",
  textAlign: "center",
  fontSize: "8px",
  fontFamily: "Avenir",
};

const tableStyle = {
  marginLeft: "5%",
  // minWidth: "10%",
};

class ButtonBar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      gcloud: false,
      upload: {
        uploadType: 'local',
        upload: null
      }
    };
    this.switchState = this.switchState.bind(this);
    this.updateUpload = this.updateUpload.bind(this);

  }

  updateUpload (newState) {
    let type;
    let path_or_id;

    if(newState.gcloud){
      type = 'gcloud';
      path_or_id = newState.cursor.id
    } else {
      type = 'local';
      path_or_id = newState.cursor.filepath
    }

    this.setState({
      upload: {
        uploadType: type,
        upload: path_or_id,
      }
    }, () => {console.log(this.state)});
  }

  switchState (newState) {

    this.setState({
      gcloud: newState,
    })
  }

  render () {
  return(
      <Fragment>
      <table style={tableStyle}>
        <tbody>
        <tr>

          <th>
            <UploadButton upload={this.state.upload}/>
          </th>

          <th>
          <div style={labelStyle}>
          <h1> Local Drive </h1>
          </div>
          </th>

          <th width="100px">
            <ModeSwitch isChecked={this.state.gcloud} switchState={this.switchState}/>
          </th>

          <th>
          <div style={labelStyle}>
          <h1> Google Drive </h1>
          </div>
          </th>

        </tr>
        </tbody>
      </table>
      <TreeExample gcloud={this.state.gcloud} cursorCallback={this.updateUpload}/>
      </Fragment>
  );
  }
}

const buttonStyle = {
  paddingLeft: "0%"
}

export { ButtonBar };
