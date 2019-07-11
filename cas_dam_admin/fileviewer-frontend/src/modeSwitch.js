import React from "react";

import './switchStyle.css';

class ModeSwitch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
			isChecked: this.props.isChecked,
		};
    this._handleChange = this._handleChange.bind(this);
  }

  componentWillMount () {
      /*
      Updates the switch state initially when it first renders. This helps
      default the switch to local/slevin.
       */
		this.setState({isChecked: this.props.isChecked})
	}

	_handleChange () {
      /*
      Callback function to send the state of the switch up to its parent
      in the buttonBar component. This callback function allows the tree
      to know which directory to render and which tree to work off of.
       */
        this.setState({
            isChecked: !this.state.isChecked,
        }, () => {this.props.switchState(this.state.isChecked)});
  }

  render() {

      /*
      empty divs inside of empty div is necessary for switch to load.
      Not sure why but do not delete it or else switch will be invisible.
      Possible this is due to notation in the styling of the switch.
       */

    return (
    <div className="switch-container">
              <label>
                  <input ref="switch" checked={this.state.isChecked} onChange={this._handleChange} className="switch" type="checkbox" />
                  <div>
                  <div></div>
                  </div>
              </label>
          </div>
    );
  }
}

export { ModeSwitch };