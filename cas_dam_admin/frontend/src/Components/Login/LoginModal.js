import React from 'react';
import Modal from 'react-modal';

// import Login from './Login'

import './Login.css'
import Login from "./Login";

const modalStyle = {
    content: {
        top: '15%',
        left: '25%',
        right: '25%',
        bottom: 'auto',
        backgroundColor: '#e8e8e8',

    }
};

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.props.setLoginModalStatus(true);
    }

    closeModal() {
        this.props.setLoginModalStatus(false);
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.showModal}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                    >
                    <Login closeModal={this.closeModal} setEmailAndPassword={this.props.setEmailAndPassword}/>
                </Modal>
            </div>
        );
    }
}

Modal.setAppElement('#root');