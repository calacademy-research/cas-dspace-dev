import React from 'react';

const tempStyle = {

};

class ExitButton extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.props.closeModal}>
                    X
                </button>
            </div>
        )
    }
}

export { ExitButton };