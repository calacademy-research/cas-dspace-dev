import React from 'react';
import Papa from 'papaparse';
import ReactDataSheet from 'react-datasheet';
import _ from 'lodash'
import axios from 'axios'
import TreeModal from './Components/treeviewer/js/TreeModal.js';
import Logger from './logger.js';

import {sendJsonAsPost, getCollections} from './api'

import 'react-datasheet/lib/react-datasheet.css';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleLogCurrentData = this.handleLogCurrentData.bind(this);
        this.sendJson = this.sendJson.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            isLoggedIn: false,
            grid: "",
            unusedMetadataEntries: "",
            collectionList: {},
            collectionUuid: "",
            collectionName: "",
            sourcePath: "/",
            folderSource: "slevin"
        };
        // TODO: Dash - let's pull this into a config file
        // https://stackoverflow.com/questions/30568796/how-to-store-configuration-file-and-read-it-using-react
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
            {value: 'ibss-library.publish', label: 'ibss-library.publish', readOnly: true}]
    }

    setSelection(newSelection) {
        // This is a callback function given to a lower component to change the state of this component
        this.setState({
            sourcePath: newSelection.path,
            folderSource: newSelection.source,
        }, () => {
            Logger.info([this.state.sourcePath, this.state.sourceFile]);
        })
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

    updateUnusedMetadataEntries(headerRow) {
        /**Returns list of items that exist in metadataEntries but not in the header row of the grid
         *
         * @type {Array}
         */
        return this.metatadataEntries.filter(item => {
            return headerRow.findIndex(x => x.value === item.value) === -1
        });
    }

    handleFileChosen(file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            // The file's text will be printed here
            let content = event.target.result;
            let parsed = Papa.parse(content, {skipEmptyLines: true});
            let rows = parsed.data;
            let newGrid = rows.map((row) => row.map(cell => {
                return ({value: cell})
            }));

            // Add header above cells that lists all unused metadata entries
            // Filter items from metadataEntries if their value is not found in newGrid[0]

            this.setState({grid: newGrid, unusedMetadataEntries: this.updateUnusedMetadataEntries(newGrid[0])})
        };


        reader.readAsText(file);
    }

    handleLogCurrentData() {
        console.log(this.state.grid);
    }

    handleSubmit(event) {
        this.sendJson();
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({collectionUuid: event.target.value});
    }

    sendJson() {
        // Convert cell structure to proper JSON
        let grid = this.state.grid;
        let jsonData = [];
        let headerRow = grid.shift();

        grid.forEach((row) => {
            let result = {};
            headerRow.forEach((item, itemIndex) => {
                result[item.value] = row[itemIndex].value
            });
            jsonData.push(result)
        });

        let dspaceConfig = {
            'collectionUuid': this.state.collectionUuid,
            'folderSource': this.state.folderSource,
            'sourcePath': this.state.sourcePath

        };

        jsonData.unshift(dspaceConfig);
        return sendJsonAsPost('http://localhost:8000/api/upload_json', jsonData)
    }


    render() {

        let collectionList = this.state.collectionList;
        let collectionOptions = [];

        // TODO: Dash give me a comment saying what object this is operating on/creatring
        
        if (collectionList) {
            Object.keys(collectionList).forEach((key) => {
                let option = <option key={collectionList[key]} value={collectionList[key]}>{key}</option>
                collectionOptions.push(option);
            });
        }

        if (this.state.grid === "") {
            return (
                <div>
                    <input type="file" accept="text/csv" onChange={e => this.handleFileChosen(e.target.files[0])}/>
                </div>
            )
        } else {
            return (
                <div>
                    <span>
                        <input type="file" accept="text/csv" onChange={e => this.handleFileChosen(e.target.files[0])}/>
                    </span>
                    <form onSubmit={this.handleSubmit}>
                        <select name='collection_uuid' onChange={this.handleChange}>
                            {collectionOptions}
                        </select>
                        <input type="submit" value="Submit"/>
                    </form>
                    <div>
                        <ReactDataSheet
                            data={[this.state.unusedMetadataEntries]}
                            valueRenderer={(cell) => cell.value}
                        />
                        <br/>
                    </div>
                    <ReactDataSheet
                        data={this.state.grid}
                        valueRenderer={(cell) => cell.value}
                        onCellsChanged={changes => {
                            const grid = this.state.grid.map(row => [...row]);
                            changes.forEach(({cell, row, col, value}) => {
                                grid[row][col] = {...grid[row][col], value}
                            });
                            this.setState({
                                grid: grid,
                                unusedMetadataEntries: this.updateUnusedMetadataEntries(grid[0])
                            })
                        }}
                    />
                    <button onClick={this.sendJson}>Print current data</button>
                    <TreeModal setSelection={this.setSelection}/>
                </div>
            )
        }
    }
}

export default App;
