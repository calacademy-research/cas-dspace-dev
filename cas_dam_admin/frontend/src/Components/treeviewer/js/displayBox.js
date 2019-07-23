import React from 'react';
import {abbreviate_path} from "./constants";
import '../css/displayBoxStyle.css';

/*
displayBox component displays the metadata of the current file.
 This display functions as a proof of concept for the idea of
 a thumbnail or general preview of files before they are selected.
 The styling was also fairly lazy, meaning it is not a finished product and does not scale well.
 */

// Display Box Purely Developement Purposes that
// allows easy tracking of 'cursor' value from the tree component


//TODO: Currently shows id with google drive. This should be changed somehow. Problem is, filepath takes too long and is also useless.
class DisplayBox extends React.Component {

  render () {

    return (
      <div className="displayBox">
        <pre> {abbreviate_path(this.props.data)}</pre>
      </div>
    );
  };
}

export { DisplayBox };
