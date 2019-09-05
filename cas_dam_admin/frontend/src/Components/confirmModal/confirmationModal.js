import React from 'react';
import Modal from 'react-modal';
import Logger from '../../logger.js';
import {Button, Form} from "react-bootstrap";

/*
Look into thumbnails
Round the draggables edges.
 */
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

        this.state = {
            isLoading: false,
            response: null,
            renderBlock: 'confirmation',
            responseText: null
        }
    }

    openModal() {
        this.props.setConfirmationModalStatus(true);
    }

    closeModal() {
        this.props.setConfirmationModalStatus(false);
    }

    verify_response(response){
        console.log(response);
        switch(response.status){
            case 204 || 401 || 400:
                Logger.warn({"statusText": response.statusText});
                this.setState({
                    renderBlock: 'error',
                    responseText: response.statusText,
                });

                break;
            case 200:
                Logger.info({"StatusText": response.statusText});
                this.setState({
                    renderBlock: 'success',
                });
                break;
            default:
                Logger.warn("Response was not a 204, 401, 400, or 200.")
        }
    }

    onConfirmation(){

        this.setState({
            renderBlock: 'loading',
        });

        this.props.submitJson()
            .then(response => this.setState({
                response: response,
            }, () => this.verify_response(this.state.response)));

    }

    render() {

        let cancelButton = (
            <div>
                <Button onClick={this.closeModal}
                        style={{display: 'inline-block', float: 'right'}}>

                    Cancel
                </Button>
            </div>
        );

        let exitButton = (
            <div>
                <Button onClick={this.closeModal}
                        style={{display: 'inline-block', float: 'left'}}>

                    Return to Spreadsheet
                </Button>
            </div>
        );

        let block = null;

        switch(this.state.renderBlock){
            case 'loading':
                block = (
                    <div>
                        <h2> Uploading...</h2>
                        {cancelButton}
                    </div>
                );
                break;
            case 'success':
                block = (
                    <div>
                        <h2>Successfully Submitted to DSpace!</h2>
                        {/*<a href={process.env.REACT_APP_DSPACE_XMLUI_URL}>*/}
                        {/*    <h2>Check out your submission here.</h2>*/}
                        {/*</a>*/}
                        {exitButton}
                    </div>
                );
                break;
            case 'error':
                block = (
                    <div>
                        <h2>Error: {this.state.responseText}</h2>
                        {exitButton}
                    </div>
                );
                break;
            case 'confirmation':
                block = (
                    <div>
                        <h2 ref={subtitle => this.subtitle = subtitle}>Are you sure you want to submit {this.props.numberOfRows} {this.props.numberOfRows === 1 ? 'row' : 'rows'}?</h2>
                        <Button onClick={this.onConfirmation}
                                style={{display: 'inline-block', float: 'left'}}>
                            Confirm
                        </Button>
                        {cancelButton}
                    </div>
                );
                break;
            default:
                Logger.error('renderBlock was invalid')

        }
        return (
            <div>
                <Modal
                    isOpen={this.props.isModalOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                    >
                    {block}
                </Modal>
            </div>
        );
    }
}

Modal.setAppElement('#root');