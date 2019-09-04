import React from 'react';
import Papa from 'papaparse';
import TreeModal from './Components/treeviewer/js/TreeModal.js';
import Logger from './logger.js';
import Sidebar from 'react-sidebar';
import Dropzone from 'react-dropzone'
import customCellRenderer from './cellRenderer.js'
import LoginModal from './Components/Login/LoginModal';
import ConfirmationModal from './Components/confirmModal/confirmationModal'
import {sendJsonAsPost, getCollections} from './api'
import 'react-datasheet/lib/react-datasheet.css';
import Instructions from './instructions'
import uploadIcon from './assets/uploadIcon.png'
import DragAndDrop from './Components/draggable/DragAndDrop.js'
import {generateDraggableData} from './Components/draggable/DragAndDropHelper'
import * as gridHelper from './Components/grid/gridHelper'


// import './bootstrap/css/bootstrap.min.css'
import './bootstrap/custom.scss'

import './App.css';
import Button from "react-bootstrap/Button";
import {verify_paths} from './file_verification'
import {calculateNonEmptyRows} from "./Components/grid/gridHelper";
import Grid from "./Components/grid/Grid";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleLogCurrentData = this.handleLogCurrentData.bind(this);
        this.handleUuidChange = this.handleUuidChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.clearGridData = this.clearGridData.bind(this);

        this.setTreeModalStatus = this.setTreeModalStatus.bind(this);
        this.setLoginModalStatus = this.setLoginModalStatus.bind(this);
        this.setConfirmationModalStatus = this.setConfirmationModalStatus.bind(this);

        this.showLoginModal = this.showLoginModal.bind(this);
        this.setEmailAndPassword = this.setEmailAndPassword.bind(this);

        this.submitJsonToBackend = this.submitJsonToBackend.bind(this);

        this.setGrid = this.setGrid.bind(this);
        this.setDraggableData = this.setDraggableData.bind(this);

        //this.update_grid_verification = this.update_grid_verification.bind(this);

        this.metadataEntries = [
            {value: 'filename', label: 'filename', readOnly: true, className: "required-column"},
            {value: 'dc.title', label: 'dc.title', readOnly: true, className: "required-column"},
            {value: 'dc.identifier (other)', label: 'dc.identifier (other)', readOnly: true},
            {value: 'dc.date', label: 'dc.date', readOnly: true},
            {value: 'dc.rights (holder)', label: 'dc.rights (holder)', readOnly: true},
            {value: 'dc.creator', label: 'dc.creator', readOnly: true, className: "required-column"},
            {value: 'dc.format', label: 'dc.format', readOnly: true},
            {value: 'dc.coverage (spatial)', label: 'dc.coverage (spatial)', readOnly: true},
            {value: 'dc.subject', label: 'dc.subject', readOnly: true},
            {value: 'dc.date (created)', label: 'dc.date (created)', readOnly: true},
            {value: 'dc.description', label: 'dc.description', readOnly: true},
            {value: 'ibss-library.taxon', label: 'ibss-library.taxon', readOnly: true},
            {value: 'ibss-library.commonName', label: 'ibss-library.commonName', readOnly: true},
            {value: 'ibss-library.familyName', label: 'ibss-library.familyName', readOnly: true},
            {value: 'ibss-library.internalNotes', label: 'ibss-library.internalNotes', readOnly: true},
            {value: 'ibss-library.containerInformation', label: 'ibss-library.containerInformation', readOnly: true},
            {value: 'ibss-library.physicalLocation', label: 'ibss-library.physicalLocation', readOnly: true},
            {
                value: 'ibss-library.filename',
                label: 'ibss-library.filename',
                readOnly: true,
                className: "required-column"
            },
            {value: 'dc.identifier (uri)', label: 'dc.identifier (uri)', readOnly: true},
            {value: 'dc.type', label: 'dc.type', readOnly: true},
            {value: 'dc.rights (statement)', label: 'dc.rights (statement)', readOnly: true},
            {value: 'dc.rights (status)', label: 'dc.rights (status)', readOnly: true},
            {value: 'ibss-library.publish', label: 'ibss-library.publish', readOnly: true}];

        // Generate grid before setting state, as we need to generate draggable data from the grid.
        // JS won't reference state while it is being created.
        let grid = gridHelper.createEmptyGrid(this.metadataEntries);

        this.state = {
            isLoggedIn: false,
            grid: grid,
            collectionList: {},
            collectionUuid: "",
            collectionName: "",
            sourcePath: "",
            folderSource: "slevin",
            isTreeModalOpen: false,
            isLoginModalOpen: false,
            isConfirmModalOpen: false,
            userEmail: "",
            userPassword: "",
            draggableData: generateDraggableData(grid),

        };
        // TODO: Dash - let's pull this into a config file
        // https://stackoverflow.com/questions/30568796/how-to-store-configuration-file-and-read-it-using-react
    }

    getHoverText() {
        let msg = 'Before submitting, please ';
        let loginMsg = 'login';
        let emptyMsg = 'fill in at least 1 row';

        let empty = calculateNonEmptyRows(this.state.grid) === 0;
        let notLoggedIn = !this.state.isLoggedIn;

        if (empty) {
            msg += emptyMsg;
            if (notLoggedIn) {
                msg += ' and ';
                msg += loginMsg
            }
        } else if (notLoggedIn) {
            msg += loginMsg
        } else {
            msg = 'You may now submit!';
            return msg
        }

        msg += '.';

        return msg
    }

    verify_grid() {
        let newGrid = JSON.parse(JSON.stringify(this.state.grid));
        let response = verify_paths(newGrid, this.state.sourcePath)
            .then(() => this.setState({
                    grid: newGrid,
                },
                () => console.log(this.state.grid)));
    }

    setSelection(newSelection) {
        /**
         * Callback function to update the source path and folder source given to a lower component
         * @param {Object.<string, string>} newSelection
         */
        // This is a callback function given to a lower component to change the state of this component
        this.setState({
            sourcePath: newSelection.path,
            folderSource: newSelection.source,
        }, () => {
            this.verify_grid()
        });

    }

    clearGridData() {
        /**
         * Resets the grid state to just the metadata header and an empty row
         */
        this.setState({grid: this.createEmptyGrid()});
    }

    // TODO: Dash comment this function
    // This funciton populates the list in the magic thingy that dash will tell me what it's actually called
    // and then selects the (first?) item so we have a sensible default if the user picks nothing.
    // We should mark this required and display a modal error
    componentDidMount() {
        // Get collections
        getCollections('/api/get_collections').then(response => {
            let collectionList = response.data;
            this.setState({collectionList: collectionList});

            // Janky, should refactor to something cleaner. Generates a default option for selecting a collection
            // Without this, there is the case of the user not changing the collection and leaving it empty when submitting
            if (this.state.collectionUuid === "") {
                this.setState({collectionUuid: collectionList[Object.keys(collectionList)[0]]})
            }
            if (this.state.collectionName === "") {
                this.setState({collectionName: Object.keys(collectionList)[0]})
            }

        });
    }


    handleFileChosen(file) {
        /**
         * Reads a file and parses it, then fills in the table with the new data
         *
         * @param {blob} file The file to be read
         */

        let reader = new FileReader();

        reader.onload = (event) => {
            // reader.onload is called after readAsText and happens after the FileReader is done reading the file

            let content = event.target.result;
            let parsed = Papa.parse(content, {skipEmptyLines: true, header: true});
            let headerRow = Papa.parse(content, {skipEmptyLines: true}).data[0];     // Get list of headers
            let rows = parsed.data;

            // {dc.title: "all in one test", dc.contributor.author: "not harrison", filename: "/dash/Downloads/cat_photo.jpg", ibss-library.filename: "cat_photo.jpg"}
            // 1: {dc.title: "second line", dc.contributor.author: "second author", filename: "/Users/Dash/Downloads/cat_photo.jpg"

            let metadataHeaders = this.metadataEntries.map(entry => entry.value);

            // Merge header rows while keeping order
            let jointArray = metadataHeaders.concat(headerRow);
            const combinedHeaderRow = jointArray.filter((item, index) => jointArray.indexOf(item) === index);
            // TODO: Dash - split out all the grid init stuff into its own function
            let grid = [combinedHeaderRow];

            let gridHeight = rows.length;
            let gridWidth = combinedHeaderRow.length;


            // Generate empty grid so we can push data to it
            for (let i = 0; i < gridHeight; i++) {
                grid.push(Array(gridWidth).fill(""))
            }

            // Iterate through columns and copy data to grid column by column

            Logger.info({'rows': rows});

            combinedHeaderRow.forEach((columnName, columnIndex) => {
                rows.forEach((row, rowIndex) => {
                    if (row[columnName]) {
                        grid[rowIndex + 1][columnIndex] = row[columnName]
                    }
                })
            });

            Logger.info({'grid': grid});

            grid = grid.map((row) => row.map(cell => {
                // Iterate through grid (represented as array of arrays) and change each cell value to an object
                return ({value: cell})
            }));


            if (gridHelper.isLastGridRowEmpty(grid)) {
                grid.push(gridHelper.generateEmptyGridRow(grid));
            }

            verify_paths(grid, this.state.sourcePath)
                .then(() => this.setState({grid: grid}));

            this.setState({draggableData: generateDraggableData(grid)});
        };


        reader.readAsText(file);
    }

    handleLogCurrentData() {
        Logger.info({'this.state.grid': this.state.grid});
    }

    handleUuidChange(event) {
        /**
         * Updates the uuid state
         */
        this.setState({collectionUuid: event.target.value});
    }


    submitJsonToBackend() {
        let gridJson = gridHelper.generateGridJson();
        return sendJsonAsPost('/api/upload_json', gridJson)
    }

    handleSubmit(event) {
        event.preventDefault();
        // TODO give feedback that the submission went through
        // Right now, the promise returned from sendJson is ignored, we should use the promise to give feedback
        this.setConfirmationModalStatus(true);

    }

    setLoginModalStatus(event) {
        this.setState({isLoginModalOpen: event})
    }

    setConfirmationModalStatus(event) {
        this.setState({isConfirmModalOpen: event})
    }

    showLoginModal() {
        this.setLoginModalStatus(true);
    }

    setTreeModalStatus(event) {
        this.setState({isTreeModalOpen: event})
    }

    setEmailAndPassword(data) {
        this.setState({userEmail: data.email, userPassword: data.password, isLoggedIn: true})
    }


    // TODO: Grid file?


    setGrid(newGrid) {
        this.setState({grid: newGrid});
    }

    setDraggableData(draggableData) {
        this.setState({draggableData: draggableData})
    }


    // TODO: This is long enough to be broken up into multiple peices. Create
    // functions for each piece so it can be clearly seen what the top level blocks are, etc.

    render() {
        let draggableZone = <DragAndDrop grid={this.state.grid} setGrid={this.setGrid}
                                         metadataEntries={this.metadataEntries}
                                         draggableData={this.state.draggableData}
                                         generateDraggableData={generateDraggableData}
                                         setDraggableData={this.setDraggableData}/>;

        let non_empty_rows = gridHelper.calculateNonEmptyRows(this.state.grid);
        let collectionList = this.state.collectionList;
        let collectionOptions = [];

        // Generates an array of <option> elements that list the available collections that can be selected.
        if (collectionList) {
            Object.keys(collectionList).forEach((key) => {
                let option = <option key={collectionList[key]} value={collectionList[key]}>{key}</option>;
                collectionOptions.push(option);
            });
        }


        // Generate login button and if authenticated, list the current email that's logged in
        let loggedInStatus = "Currently not logged in.";
        let authenticationAction = "DSpace Log In";

        if (this.state.isLoggedIn) {
            loggedInStatus = "Logged in as: " + this.state.userEmail;
            authenticationAction = "Change User";
        }
        // TODO: e.g.: This is "createLoginArea".
        let loginArea = (
            <div>
                <div className='display-box'>
                    <p>{loggedInStatus}</p>
                    <div className="default-button-container">
                        <Button onClick={() => this.setLoginModalStatus(true)}
                                variant='info'
                                className='default-button'>
                            {authenticationAction}
                        </Button>
                    </div>
                </div>
            </div>

        );

        let header = (
            <div className='sidebar-element'>
                <h2> DSpace Uploader </h2>
                <h6> Upload a CSV to begin </h6>
            </div>
        );

        let clearButton = (
            <div className='default-button-container'>
                <Button onClick={this.clearGridData}
                        variant='danger'
                        className='default-button'>

                    Clear data
                </Button>
            </div>
        );

        let filepathText = 'Currently selected folder source: ';
        let filepathButtonText = 'Change Folder';


        if (this.state.sourcePath === '') {
            filepathText = 'No folder currently selected';
            filepathButtonText = "Select a Folder"
        }

        // Generate the folder selector button, list the path to the folder
        let selectedPath = (
            <div className='display-box'>
                <p>{filepathText}</p>
                <p style={{fontSize: '12px', wordWrap: 'break-word'}}>{this.state.sourcePath}</p>
            </div>);

        let pathButton = (
            <div className="default-button-container">
                <Button onClick={() => this.setTreeModalStatus(true)}
                        title={"Select a root folder that contains all the files listed in the csv"}
                        variant='info'
                        className='default-button'>

                    {filepathButtonText}
                </Button>
            </div>
        );

        let fileviewerArea = (

            <div className='display-box'>
                <p>{filepathText}</p>
                <p style={{fontSize: '12px', wordWrap: 'break-word'}}>{this.state.sourcePath}</p>
                {pathButton}
            </div>);

        // Generate the file upload button and area
        let fileUploadArea = (
            <div>
                <Dropzone
                    onDrop={acceptedFiles => this.handleFileChosen(acceptedFiles[0])}
                    accept={'text/csv'}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div className="upload-box" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="upload-text">
                                    <img className="Img" src={uploadIcon} alt="upload"/>
                                    <p>Click me or drag CSV file here</p>
                                </div>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        );

        let submitButtonDisabled = calculateNonEmptyRows(this.state.grid) === 0 || !this.state.isLoggedIn;

        let collectionSelector = (
            <div className='display-box collection-box'>
                <p>Collection: &nbsp; </p>
                <select name='collection_uuid' onChange={this.handleUuidChange} style={{width: '50%'}}>
                    {collectionOptions}
                </select>
            </div>
        );

        let submitButton = (
            <div className='default-button-container'>
                <Button variant={!submitButtonDisabled ? 'success' : 'secondary'}
                        onClick={this.handleSubmit}
                        disabled={submitButtonDisabled}
                        title={this.getHoverText()}
                        className='default-button'>

                    Submit {non_empty_rows} {non_empty_rows === 1 ? 'row' : 'rows'}

                </Button>
            </div>
        );

        let instructionBox = (
            <div className='display-box-text'>
                <Instructions/>
            </div>
        );

        let buffer = (
            <div style={{paddingTop: '12.5px'}}/>
        );

        // TODO: Move sidebar into separate component
        let sidebar = (
            <div>
                {buffer}
                {header}
                {loginArea}
                {buffer}
                {fileUploadArea}
                {buffer}
                {fileviewerArea}
                {buffer}
                {collectionSelector}
                {buffer}
                {submitButton}
                {clearButton}
                {buffer}
                {instructionBox}
            </div>
        );

        let sidebarProps = {
            sidebar,
            width: 200,
            docked: true,
            touch: false,
            shadow: false,
            open: false,
            styles: {
                sidebar: {background: '#e8e8e8', zIndex: 0, width: 225},
                content: {background: 'white'}
            },
            transitions: false
        };
        return (
            <Sidebar {...sidebarProps}>
                <div>
                    <LoginModal setEmailAndPassword={this.setEmailAndPassword}
                                isModalOpen={this.state.isLoginModalOpen}
                                setLoginModalStatus={this.setLoginModalStatus}/>

                    <ConfirmationModal isModalOpen={this.state.isConfirmModalOpen}
                                       setConfirmationModalStatus={this.setConfirmationModalStatus}
                                       submitJson={this.submitJsonToBackend}
                                       numberOfRows={non_empty_rows}
                    />

                    {draggableZone}
                    <Grid grid={this.state.grid} setGrid={this.setGrid} sourcePath={this.state.sourcePath}/>
                    {/* This is a debug hook for now*/}
                    {/*<button onClick={this.generateGridJson}>Print current data</button>*/}
                    <TreeModal isModalOpen={this.state.isTreeModalOpen} setSelection={this.setSelection}
                               setTreeModalStatus={this.setTreeModalStatus}/>
                    {/*<Button onClick={this.clearGridData}>Clear data</Button>*/}

                </div>
            </Sidebar>
        )
    }
}

export default App;
