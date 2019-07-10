import React from 'react';
import Papa from 'papaparse';
import ReactDataSheet from 'react-datasheet'
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
        };
        this.metatadataEntries = [
            {value: 'filename', label: 'filename'},
            {value: 'dc.title', label: 'dc.title'},
            {value: 'dc.identifier (other)', label: 'dc.identifier (other)'},
            {value: 'dc.date', label: 'dc.date'},
            {value: 'dc.rights (holder)', label: 'dc.rights (holder)'},
            {value: 'dc.creator', label: 'dc.creator'},
            {value: 'dc.format', label: 'dc.format'},
            {value: 'dc.coverage (spatial)', label: 'dc.coverage (spatial)'},
            {value: 'dc.subject', label: 'dc.subject'},
            {value: 'dc.date (created)', label: 'dc.date (created)'},
            {value: 'dc.description', label: 'dc.description'},
            {value: 'ibss-library.taxon', label: 'ibss-library.taxon'},
            {value: 'ibss-library.commonName', label: 'ibss-library.commonName'},
            {value: 'ibss-library.familyName', label: 'ibss-library.familyName'},
            {value: 'ibss-library.internalNotes', label: 'ibss-library.internalNotes'},
            {value: 'ibss-library.containerInformation', label: 'ibss-library.containerInformation'},
            {value: 'ibss-library.physicalLocation', label: 'ibss-library.physicalLocation'},
            {value: 'ibss-library.filename', label: 'ibss-library.filename'},
            {value: 'dc.identifier (uri)', label: 'dc.identifier (uri)'},
            {value: 'dc.type', label: 'dc.type'},
            {value: 'dc.rights (statement)', label: 'dc.rights (statement)'},
            {value: 'dc.rights (status)', label: 'dc.rights (status)'},
            {value: 'ibss-library.publish', label: 'ibss-library.publish'}]
    }


    handleFileChosen(file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            // The file's text will be printed here
            let content = event.target.result;
            let parsed = Papa.parse(content, {skipEmptyLines: true});
            let rows = parsed.data;
            this.setState({
                grid: rows.map(row => row.map(cell => {
                    return ({value: cell})
                }))
            })

        };

        reader.readAsText(file);
    }

    handleLogCurrentData() {
        console.log(this.state.grid);
    }


    render() {
        if (this.state.grid === "") {
            return (
                <span>
            <input type="file" accept="text/csv" onChange={e => this.handleFileChosen(e.target.files[0])}/>
        </span>
            )
        } else {
            return (
                <div>
                    <span>
                        <input type="file" accept="text/csv" onChange={e => this.handleFileChosen(e.target.files[0])}/>
                    </span>
                    <ReactDataSheet
                        data={this.state.grid}
                        valueRenderer={(cell) => cell.value}
                        onCellsChanged={changes => {
                            const grid = this.state.grid.map(row => [...row]);
                            changes.forEach(({cell, row, col, value}) => {
                                grid[row][col] = {...grid[row][col], value}
                            });
                            this.setState({grid})
                        }}
                    />
                    <button onClick={this.handleLogCurrentData}>Print current data</button>
                </div>
            )
        }
    }
}

export default App;
