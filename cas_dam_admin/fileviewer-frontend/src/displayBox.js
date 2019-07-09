import React from 'react'


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

}

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
