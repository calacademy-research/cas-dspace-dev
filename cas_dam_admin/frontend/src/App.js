import React from 'react';
import Papa from 'papaparse';
import ReactDataSheet from 'react-datasheet';
import Select from 'react-select';
import _ from 'lodash'

import 'react-datasheet/lib/react-datasheet.css';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleLogCurrentData = this.handleLogCurrentData.bind(this);
        this.state = {
            isLoggedIn: false,
            grid: "",
            unusedMetadataEntries: ""
        };
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

    updateUnusedMetadataEntries(headerRow) {
        /**Returns list of items that exist in metadataEntries but not in the header row of the grid
         *
         * @type {Array}
         */
        return this.metatadataEntries.filter(item => {
            return headerRow.findIndex(x => x.value === item.value) === -1
        });
    }

    getHeaderPositionFromName(name) {
        return this.state.grid[0].findIndex(x => x.value === name)
    }


    handleFileChosen(file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            // The file's text will be printed here
            let content = event.target.result;
            let parsed = Papa.parse(content, {skipEmptyLines: true});
            let rows = parsed.data;
            let newGrid = rows.map(row => row.map(cell => {
                return ({value: cell, component: this.autofillHeaderCellComponent()})
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

    autofillHeaderCellComponent = (id) => {
        let metadataOptions = this.metatadataEntries.map(item => _.pick(item, ['value', 'label']));
        if (this.state.unusedMetadataEntries !== "") {
            metadataOptions = this.state.unusedMetadataEntries.map(item => _.pick(item, ['value', 'label']));
        }

        return (
            <Select
                // value={this.state && this.state.grocery[id]}
                // onChange={(opt) => this.setState({grocery: _.assign(this.state.grocery, {[id]: opt})})}
                onChange={(opt) => {
                    this.setState({grid: _.assign(this.state.grid,)})
                    console.log(opt)
                }}
                options={metadataOptions}
            />
        )
    }


    render() {
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
                    <button onClick={this.handleLogCurrentData}>Print current data</button>
                </div>
            )
        }
    }
}

export default App;
