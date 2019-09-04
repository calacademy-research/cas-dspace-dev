import React from 'react';
import customCellRenderer from "../../cellRenderer";
import {verify_paths} from "../../file_verification";
import Logger from "../../logger";
import * as gridHelper from "./gridHelper";
import {generateDraggableData} from "../draggable/DragAndDropHelper";
import ReactDataSheet from "react-datasheet";


export default class Grid extends React.Component {
    render() {
        return <ReactDataSheet
            data={this.props.grid}
            valueRenderer={(cell) => cell.value}
            cellRenderer={customCellRenderer}
            onCellsChanged={changes => {
                // Duplicate the grid, and then apply each change to the new grid
                let grid = this.props.grid.map(row => [...row]);
                changes.forEach(({cell, row, col, value}) => {
                    grid[row][col] = {...grid[row][col], value}
                });
                // TODO: move this to separate verification file
                verify_paths(grid, this.props.sourcePath).then(response => Logger.info({"Updated Grid": response}));

                // Add a new row to the bottom of the array if the current last one has data in it
                if (gridHelper.isLastGridRowEmpty(grid)) {
                    grid.push(this.generateEmptyGridRow(grid));
                }
                generateDraggableData(grid);

                this.props.setGrid(grid)
            }}
        />
    }
}