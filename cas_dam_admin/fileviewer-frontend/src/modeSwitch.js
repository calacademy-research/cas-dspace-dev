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
		this.setState({isChecked: this.props.isChecked})
	}

	_handleChange () {
        this.setState({
            isChecked: !this.state.isChecked,
        }, () => {this.props.switchState(this.state.isChecked)});
  }

  render() {

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