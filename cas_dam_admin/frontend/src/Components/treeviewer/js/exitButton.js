import React from 'react';

class ExitButton extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.props.closeModal}>Exit</button>
            </div>
        )
    }
}

export { ExitButton };