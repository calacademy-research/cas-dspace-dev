import React from 'react';
import Modal from 'react-modal';
import Logger from '../../logger.js';

const modalStyle = {
    content: {
        top: '15%',
        left: '25%',
        right: '25%',
        bottom: 'auto',
        backgroundColor: '#e8e8e8',

    }
};

export default class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onConfirmation = this.onConfirmation.bind(this);
    }

    openModal() {
        this.props.setConfirmationModalStatus(true);
    }

    closeModal() {
        this.props.setConfirmationModalStatus(false);
    }

    onConfirmation(){
        this.props.submitJson().then(response => Logger.info({'Response': response}));
        this.closeModal()
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isModalOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                    >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Are you sure you want to submit?</h2>
                    <button onClick={this.onConfirmation}> Confirm </button>
                    <button onClick={this.closeModal}> Cancel </button>
                </Modal>
            </div>
        );
    }
}

Modal.setAppElement('#root');