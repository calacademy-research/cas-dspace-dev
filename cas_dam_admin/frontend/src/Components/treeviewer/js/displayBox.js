import React from 'react';
import '../css/displayBoxStyle.css';

/*
displayBox component displays the metadata of the current file.
 This display functions as a proof of concept for the idea of
 a thumbnail or general preview of files before they are selected.
 The styling was also fairly lazy, meaning it is not a finished product and does not scale well.
 */

// Display Box Purely Developement Purposes that
// allows easy tracking of 'cursor' value from the tree component

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
      <div className="displayBox">
        <pre>{this.format(this.props.data)}</pre>
      </div>
    );
  };
}

export { DisplayBox };
