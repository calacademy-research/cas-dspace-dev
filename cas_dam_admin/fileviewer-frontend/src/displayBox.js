import React from 'react'

/*
displayBox component displays the metadata of the current file.
 This display functions as a proof of concept for the idea of
 a thumbnail or general preview of files before they are selected.
 The styling was also fairly lazy, meaning it is not a finished product and does not scale well.
 */

const boxStyle = {
  textAlign: 'left',
  color: 'black',
  padding: "10px 10px",
  border: "0px solid",
  borderColor: "#E2C089",
  display: "inlineBlock",
  float: 'left',
  width: '40%',
  height: '100%',
  background: '#9DA5AB',

};
// TODO: Doomed, harrison, displays the json of the file you selected, for development
class DisplayBox extends React.Component {
  
  format (json) {
    if(json != null) {
      return (
        JSON.stringify(json, null, 3)
      )
    } else {
      return (
        "Select a file to view its info."
      )
    }
  }

  render () {

    return (
      <div style={boxStyle}>
        <pre>{this.format(this.props.data)}</pre>
      </div>
    );
  };
};

export { DisplayBox };
