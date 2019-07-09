import React, { Fragment } from "react";
import { TreeExample } from './tree.js';
import './switchStyle.css';

const labelStyle = {
  color: "#E2C089",
  textAlign: "center",
  fontSize: "8px",
  fontFamily: "Avenir",
}

const tableStyle = {
  marginLeft: "10%",
  minWidth: "10%",
}


class ModeSwitch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
			isChecked: true
		}
    this._handleChange = this._handleChange.bind(this)
  }

	componentWillMount () {
		this.setState({isChecked: this.props.isChecked});
	}

  render () {

  return(
      <Fragment>
      <table style={tableStyle}>
        <tr>
          <th>
          <div style={labelStyle}>
          <h1> Local Drive </h1>
          </div>
          </th>

          <th width="100px">
          <div className="switch-container">
              <label>
                  <input ref="switch" checked={this.state.isChecked} onChange={this._handleChange} className="switch" type="checkbox" />
                  <div>
                  <div></div>
                  </div>
              </label>
          </div>
          </th>

          <th>
          <div style={labelStyle}>
          <h1> Google Drive </h1>
          </div>
          </th>

        </tr>
      </table>
      <TreeExample gcloud={this.state.isChecked}/>
      </Fragment>
  );
  }

  _handleChange () {
		this.setState({ isChecked: !this.state.isChecked });
  }
}

//React.render( <Switch isChecked={ true } />, document.getElementById( "page" ) );

const buttonStyle = {
  paddingLeft: "0%"
}

class ModeButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gcloud: true,
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    if(this.state.gcloud) {
      this.setState({
        gcloud: false,
      })
    } else {
      this.setState({
        gcloud: true,
      })
    }
    console.log("Mode has been updated!")
  }

  render() {
    console.log('Button Rendered')
      return (
      <Fragment>
        <div>
        <button type="button" onClick={this.onClick} style={buttonStyle}>Swap Modes</button>
        </div>
        <TreeExample gcloud={this.state.gcloud}/>
      </Fragment>
      )
  }


}

export { ModeButton, ModeSwitch };
