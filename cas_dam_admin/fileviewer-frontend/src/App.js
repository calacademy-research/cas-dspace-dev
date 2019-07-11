import {Header} from './header.js'
import {ButtonBar} from './buttonBar.js'
import React, {Fragment} from 'react'
import Modal from 'react-modal';

/*
This wraps all of the existing components in an app
that can be served to the render to DOM. The React Fragment
method is the preferred method of wrapping components rather
than simply a div.
 */

class FileViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <ButtonBar closeModal={this.props.closeModal} setSelection={this.props.setSelection}/>
            </Fragment>
        )
    }
}

/*
filepath
type of file
 */
// TODO: Let's move this to a .css file.
const customStyles = {
    content: {
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        backgroundColor: "#21252B",
    }
};

//TODO: Add comment - this is the top level for the treeviewer
//TODO: Rename "app" to tree viewer modal or something like that.
// TODO: Document the "food chain" of setselection and closemodal. Describe that this is part of the button
// press handling.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            selection: null,
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        //TODO: Move SetSelection to root Parent once fileviewer is attached to csv uploader.
        this.setSelection = this.setSelection.bind(this);
    }

    setSelection(newSelection) {
        this.setState({
            selection: newSelection,
        }, () => {
            //TODO: This is the hook for calling into the main app
            console.log(this.state)
        })
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //
    }

    closeModal() {
        this.setState({modalIsOpen: false});

    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>Open Modal</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}>
                    <FileViewer closeModal={this.closeModal} setSelection={this.setSelection}/>
                </Modal>
            </div>
        );
    }
}

//TODO Joe: This isn't resolving in pycharm, why?
Modal.setAppElement('#root');

export default App;
