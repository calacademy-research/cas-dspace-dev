import React from 'react';
import '../css/ExitButton.css';

class ExitButton extends React.Component {

    render() {
        return (
            <div>
                <button type="button" className="ExitButton" onClick={this.props.closeModal} style={{outline: 'none'}}>
                    x
                </button>
            </div>
        )
    }
}

export { ExitButton };