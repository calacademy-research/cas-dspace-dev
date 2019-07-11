import React from 'react';
import './App.css';
import CSVSelect from './components/CSVSelect'
import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css';
import axios from "axios";

import querystring from 'querystring'

// const {dialog} = require('electron').remote;
// const {app} = require('electron').remote;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            isLoggedIn: false,
            itemTable: "",
            grid: ""
        }


    }

    componentDidMount() {
        this.handleLogin();
    }

    updateItemTable = (newItemTable) => {
        this.setState({itemTable: newItemTable});
        console.log("new table of data");

        let grid = newItemTable.data.map(row => row.map(item => this.convertStringToCell(item)));
        console.log(grid)

        this.setState({grid: grid})
    };

    convertStringToCell(item) {
        /**
         * Converts a string to an object {value: string}
         *
         * @typedef {Object} Cell
         * @property {string} cellValue
         *
         * @param {string} item
         * @return {Cell}
         */
        return {value: item}
    }

    handleLogin() {


        axios.post('http://localhost:8000/proxy/http://localhost:8080/rest/login', querystring.stringify({
            email: "test@test.edu", password: "test"
        }), {
            withCredentials: true,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}

        }).catch(function (error) {
            // handle error
            console.log('Login error: ' + error);
        }).then(() => this.handleStatus())
    }

    handleStatus() {
        let config = {
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        };

        axios.get('http://localhost:8080/rest/status', config).then((res2) => {
            if (res2.data['authenticated']) {
                this.setState({isLoggedIn: true})
            }
            console.log(res2.data);
            App.getMetadataEntries();
        })
    }

    static getMetadataEntries() {
        let config = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        };

        let entries = [
            'filename',
            'dc.title',
            'dc.identifier (other)',
            'dc.date',
            'dc.rights (holder)',
            'dc.creator',
            'dc.format',
            'dc.coverage (spatial)',
            'dc.subject',
            'dc.date (created)',
            'dc.description',
            'ibss-library.taxon',
            'ibss-library.commonName',
            'ibss-library.familyName',
            'ibss-library.internalNotes',
            'ibss-library.containerInformation',
            'ibss-library.physicalLocation',
            'ibss-library.filename',
            'dc.identifier (uri)',
            'dc.type',
            'dc.rights (statement)',
            'dc.rights (status)',
            'ibss-library.publish'];

        // axios.get('http://localhost:8080/rest/registries/schema', config).then((res3) => {
        //
        //         console.log(res3.data);
        //     }
        // )

        return entries;


    }

    registerItem() {
        let data = {
            "metadata": [
                {
                    "key": "dc.contributor.author",
                    "value": "React, Electron"
                },
                {
                    "key": "dc.title",
                    "value": "A test from electron"
                }
            ]
        };

        axios.post('http://localhost:8080/rest/collections/32a898bb-a2e3-46c0-8862-a7e4802791ba/items', JSON.stringify(data), {
            headers: {"Accept": "application/json", 'Content-Type': 'application/json',},
            withCredentials: true,
        }).catch(function (error) {
                // handle error
                console.log('Login error: ' + error);
            }
        )


    }


    render() {

        // dialog.showOpenDialog(
        //     {
        //         title: "Select a CSV file to read",
        //         defaultPath: app.getPath('home'),
        //         filters: [
        //             {name: 'CSV Files', extensions: ['csv']}
        //         ],
        //         properties: ['openFile', 'multiSelections'],
        //
        //     }, function (response) {
        //         console.log("Something happened!");
        //         console.log(response);
        //     });

        let page;


        if (this.state.grid !== "") {
            console.log(this.state.grid);
            page = (<div>
                <CSVSelect parentCallback={this.updateItemTable}/>
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
                <button onClick={console.log(this.state.grid)}>Print current data</button>
            </div>)

        } else {
            page = (
                <div>
                    <CSVSelect parentCallback={this.updateItemTable}/>
                </div>
            )
        }

        return page;
    }
}

export default App;
