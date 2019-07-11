import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import fs from 'fs';
import Papa from 'papaparse';



const {dialog} = require('electron').remote;
const {app} = require('electron').remote;

class CSVSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileSelectClick = this.handleFileSelectClick.bind(this);
        this.state = {
            csvPath: "",
            csvValues: {}
        }
    }


    handleFileSelectClick() {
        dialog.showOpenDialog(
            {
                title: "Select a CSV file to read",
                defaultPath: app.getPath('home'),
                filters: [
                    {name: 'CSV Files', extensions: ['csv']}
                ],
                properties: ['openFile'],

            }, (response) => {
                if (response !== undefined) {
                    this.setState({csvPath: response[0]});
                    this.loadCSV()
                }

            });
    }

    loadCSV() {
        let raw_data = fs.readFileSync(this.state.csvPath, {encoding: 'utf-8'});

        this.setState({csvValues: Papa.parse(raw_data, {skipEmptyLines: true})});

        this.updateApp()
    }

    updateApp = () => {
        this.props.parentCallback(this.state.csvValues);
    };

    render() {

        return (
            <div>
                <Button variant="primary" onClick={this.handleFileSelectClick}>Upload CSV file</Button>
            </div>
        );
    }

}

export default CSVSelect;
