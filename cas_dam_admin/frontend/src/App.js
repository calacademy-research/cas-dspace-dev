import React from 'react';
import Papa from 'papaparse';
import ReactDataSheet from 'react-datasheet';
import TreeModal from './Components/treeviewer/js/TreeModal.js';
import Logger from './logger.js';
import Sidebar from 'react-sidebar';

import LoginModal from './Components/Login/LoginModal';

import {sendJsonAsPost, getCollections} from './api'

import 'react-datasheet/lib/react-datasheet.css';

// import './bootstrap/css/bootstrap.min.css'
import './bootstrap/custom.scss'

import './App.css';
import Button from "react-bootstrap/Button";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleLogCurrentData = this.handleLogCurrentData.bind(this);
        this.generateGridJson = this.generateGridJson.bind(this);
        this.handleUuidChange = this.handleUuidChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.clearGridData = this.clearGridData.bind(this);
        this.setModalStatus = this.setModalStatus.bind(this);
        this.setLoginModalStatus = this.setLoginModalStatus.bind(this);
        this.showLoginModal = this.showLoginModal.bind(this);

        this.metatadataEntries = [
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

        this.state = {
            isLoggedIn: false,
            grid: this.createEmptyGrid(),
            collectionList: {},
            collectionUuid: "",
            collectionName: "",
            sourcePath: "/",
            folderSource: "slevin",
            isModalOpen: false,
            showLoginModal: false,
        };
        // TODO: Dash - let's pull this into a config file
        // https://stackoverflow.com/questions/30568796/how-to-store-configuration-file-and-read-it-using-react
    }

    // Return an empty row that's the size of the grid
    generateEmptyGridRow(grid) {
        /**
         * Generates an array of objects with empty strings
         * @param {Object.<string>[][]} grid the grid to match sizes with
         *
         * @returns {Object.<string>[]} an array of objects with empty strings
         */
        return Array(grid[0].length).fill({value: ""});   // Generate an row with the same

    }


    //Creates an empty grid, does not deal with the state object.
    // We need to do this because the grid has data preconditions
    createEmptyGrid() {
        /**
         * Creates a new grid that uses all of the metadata fields and an empty row beneath it
         * @returns {Object.<string>[][]} an array of two rows: the header row and an empty row
         */

        let grid = [];
        let headerRow = [];

        // Populate first row of grid with value of each metadata entry
        this.metatadataEntries.forEach(entry => headerRow.push({value: entry.value}));

        grid.push(headerRow);
        grid.push(this.generateEmptyGridRow(grid));
        return grid
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
            Logger.info([this.state.sourcePath, this.state.folderSource]);
        })
    }

    clearGridData() {
        /**
         * Resets the grid state to just the metadata header and an empty row
         */
        this.setState({grid: this.createEmptyGrid()});
    }

    // TODO: Dash comment this funciton
    // This funciton populates the list in the magic thingy that dash will tell me what it's actually called
    // and then selects the (first?) item so we have a sensible default if the user picks nothing.
    // We should mark this required and display a modal error
    componentDidMount() {
        // Get collections
        getCollections('http://localhost:8000/api/get_collections').then(response => {
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

            let metadataHeaders = this.metatadataEntries.map(entry => entry.value);

            // Merge header rows while keeping order
            let jointArray = metadataHeaders.concat(headerRow);
            const combinedHeaderRow = jointArray.filter((item, index) => jointArray.indexOf(item) === index);

            let grid = [combinedHeaderRow];

            let gridHeight = rows.length;
            let gridWidth = combinedHeaderRow.length;


            // Generate empty grid so we can push data to it
            for (let i = 0; i < gridHeight; i++) {
                grid.push(Array(gridWidth).fill(""))
            }

            // Iterate through columns and copy data to grid column by column

            console.log(rows);

            combinedHeaderRow.forEach((columnName, columnIndex) => {
                rows.forEach((row, rowIndex) => {
                    if (row[columnName]) {
                        grid[rowIndex + 1][columnIndex] = row[columnName]
                    }
                })
            });

            console.log(grid);

            grid = grid.map((row) => row.map(cell => {
                // Iterate through grid (represented as array of arrays) and change each cell value to an object
                return ({value: cell})
            }));


            if (this.isLastGridRowEmpty(grid)) {
                grid.push(this.generateEmptyGridRow(grid));
            }


            this.setState({grid: grid})
        };


        reader.readAsText(file);
    }

    handleLogCurrentData() {
        console.log(this.state.grid);
    }

    handleUuidChange(event) {
        /**
         * Updates the uuid state
         */
        this.setState({collectionUuid: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        // TODO give feedback that the submission went through
        // Right now, the promise returned from sendJson is ignored, we should use the promise to give feedback
        let gridJson = this.generateGridJson();
        return sendJsonAsPost('http://localhost:8000/api/upload_json', gridJson)

    }

    generateGridJson() {
        // Convert cell structure to proper JSON
        let grid = this.state.grid;
        let jsonData = [];
        let headerRow = grid.shift();   // Remove header row, as we will be applying it to each of the subsequent rows

        // We convert from a grid format where the headers are one row and the data is in rows below it to an array
        // of objects. In each object, the header for the column is they key, and the cell data is the value.

        grid.forEach((row) => {
            let result = {};
            headerRow.forEach((item, itemIndex) => {
                result[item.value] = row[itemIndex].value
            });
            jsonData.push(result)
        });

        // dspaceConfig is the header that contains properties that apply to every item in the array.
        // folderSource defines where the files will come from: gdrive or slevin
        // sourcePath is the path to the closest common directory shared between all the files.
        let dspaceConfig = {
            'collectionUuid': this.state.collectionUuid,
            'folderSource': this.state.folderSource,
            'sourcePath': this.state.sourcePath

        };

        // Insert the config at the beginning of the array to be sent to the server
        jsonData.unshift(dspaceConfig);
        return jsonData
    }

    isLastGridRowEmpty(grid) {
        /**
         * Sees if the last row in the grid is empty (contains only empty strings)
         *
         * @returns {bool} True if the last row is empty, false if there is a non-empty string
         */
        let lastRow = grid[grid.length - 1];

        return (lastRow.some(cell => cell.value !== ""))
    }

    setLoginModalStatus(event) {
        this.setState({showLoginModal: event})
    }

    showLoginModal() {
        this.setLoginModalStatus(true);
    }

    setModalStatus(event) {
        this.setState({isModalOpen: event})
    }


    render() {

        let collectionList = this.state.collectionList;
        let collectionOptions = [];

        // Generates an array of <option> elements that list the available collections that can be selected.
        if (collectionList) {
            Object.keys(collectionList).forEach((key) => {
                let option = <option key={collectionList[key]} value={collectionList[key]}>{key}</option>;
                collectionOptions.push(option);
            });
        }

        let sidebar = (
            <div>
                <button onClick={() => this.setLoginModalStatus(true)}>Show Login</button>
                <span>
                    <input type="file" accept="text/csv" onChange={e => this.handleFileChosen(e.target.files[0])}/>
                </span>
                <form onSubmit={this.handleSubmit}>
                    <select name='collection_uuid' onChange={this.handleUuidChange}>
                        {collectionOptions}
                    </select>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );

        let sidebarProps = {
            sidebar,
            docked: true,
            touch: false,
            shadow: false,
            open: false,
            styles: {
                sidebar: {background: '#e8e8e8', zIndex: 0},
                content: {background: 'white'}
            },
            transitions: false
        };

        return (
            <Sidebar {...sidebarProps}>
                <div>
                    <LoginModal showModal={this.state.showLoginModal} setLoginModalStatus={this.setLoginModalStatus}/>
                    <ReactDataSheet
                        data={this.state.grid}
                        valueRenderer={(cell) => cell.value}
                        onCellsChanged={changes => {
                            // Duplicate the grid, and then apply each change to the new grid
                            let grid = this.state.grid.map(row => [...row]);
                            changes.forEach(({cell, row, col, value}) => {
                                grid[row][col] = {...grid[row][col], value}
                            });

                            // Add a new row to the bottom of the array if the current last one has data in it
                            if (this.isLastGridRowEmpty(grid)) {
                                grid.push(this.generateEmptyGridRow(grid));
                            }

                            this.setState({
                                grid: grid,
                            })
                        }}
                    />
                    {/* This is a debug hook for now*/}
                    <button onClick={this.generateGridJson}>Print current data</button>
                    <TreeModal isModalOpen={this.state.isModalOpen} setSelection={this.setSelection}
                               setModalStatus={this.setModalStatus}/>
                    <button onClick={this.clearGridData}>Clear data</button>

                </div>
            </Sidebar>
        )
    }
}

export default App;
