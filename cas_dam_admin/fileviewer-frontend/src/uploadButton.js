//https://codepen.io/KPCodes/pen/QgKREZ

import React from 'react';
import './uploadButtonStyle.css';


class UploadButton extends React.Component {
  constructor(props){
    super(props);
  }

  handleBtnClick = () => {
    console.log(this.props.upload)
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