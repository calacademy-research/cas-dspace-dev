import { FileViewer } from './fileviewer.js';
import React from 'react';
import Modal from 'react-modal';
import '../css/modalStyle.scss';
import Logger from "../../../logger";

/*
Eventually this should be moved to a CSS doc but right now
that move is not working as expected. Eventually the styling
should be housed in modalStyle.scss
 */

const modalStyle = {
    content: {
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        backgroundColor: '#21252B',
    }
};

/*
This app is component is the top level for the treeviewer,
it is the modal that contains the treeviewer component.

The setSelection and closeModal are passed down as props from
TreeModal --> ButtonBar --> UploadButton and used as callback functions.
 */

class TreeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selection: null,
        };

        this.openModal = this.openModal.bind(this);
        // this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        // this.setState({modalIsOpen: true});
        this.props.setTreeModalStatus(true)
    }

    // afterOpenModal() {
    // Runs right after modal is rendered, could be used for running JS
    //     // references are now sync'd and can be accessed.
    //     //
    // }

    closeModal() {
        // This is a callback function given to a lower component to change the state of this component
        this.props.setTreeModalStatus(false);

    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isModalOpen}
                    // onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    //className="modal"
                    style={modalStyle}
                    >
                    <FileViewer closeModal={this.closeModal} setSelection={this.props.setSelection}/>
                </Modal>
            </div>
        );
    }
}

//TODO Joe: This isn't resolving in pycharm, why?
Modal.setAppElement('#root');

export default TreeModal;
