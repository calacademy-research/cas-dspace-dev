import React from 'react'
import {DragDropContext} from "react-beautiful-dnd";
import Column from "./column";
import _ from 'lodash'

export default class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);
        this.isHeaderInSchema = this.isHeaderInSchema.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({count: nextProps.value});
        }
    }

    moveColumn(source, destination) {
        let sourceIndex = this.getColumnIndexFromName(source);
        let destinationIndex = this.getColumnIndexFromName(destination);

        let newGrid = this.props.grid;

        let cell;
        newGrid.forEach((row, rowIndex) => {

            cell = newGrid[rowIndex][sourceIndex];
            // remove cell at index, then insert it at new index
            newGrid[rowIndex].splice(sourceIndex, 1);
            newGrid[rowIndex].splice(destinationIndex, 0, cell)
        });

        this.props.setGrid(newGrid);

    }

    mergeColumns(source, destination) {
        let sourceIndex = this.getColumnIndexFromName(source);
        let destinationIndex = this.getColumnIndexFromName(destination);

        let newGrid = this.props.grid;

        newGrid.forEach((row, rowIndex) => {
            // overwrite destination cell, then Remove value from source cell
            if (rowIndex !== 0) {
                newGrid[rowIndex][destinationIndex] = newGrid[rowIndex][sourceIndex];
            }
            newGrid[rowIndex].splice(sourceIndex, 1);
        });

        this.props.setGrid(newGrid);

    }


    onDragEnd = result => {
        console.log(result)
        const {destination, source, draggableId, combine} = result;

        if (!combine) {
            return;
        }

        let sourceName = this.props.grid[0][source.index].value;

        let destinationName = this.props.draggableData.headers[combine.draggableId].content;


        // Don't combine if source and destination are both part of the schema
        if (this.isHeaderInSchema(sourceName) && this.isHeaderInSchema(destinationName)) {
            return
        }


        let newDraggableData = this.props.draggableData;

        // Remove references to the source column
        newDraggableData.columnOrder.splice(source.index, 1);
        delete newDraggableData.columns[source.droppableId];
        delete newDraggableData.headers[source.draggableId];

        this.mergeColumns(sourceName, destinationName);

        this.props.setDraggableData(newDraggableData);

    };

    getColumnIndexFromName(columnName) {
        return this.props.grid[0].findIndex(item => item.value === columnName);
    }

    isHeaderInSchema(name) {
        return this.props.metadataEntries.findIndex(item => item.value === name) >= 0;

    }

    render() {
        let columns = this.props.draggableData.columnOrder.map((columnId, index) => {
            const column = this.props.draggableData.columns[columnId];
            const headers = column.headerIds.map(headerId => this.props.draggableData.headers[headerId]);
            return <Column key={column.id}
                           column={column}
                           headers={headers}
                           isHeaderInSchema={this.isHeaderInSchema}
                           grid={this.props.grid}/>;
        });
        columns = _.chunk(columns, 6).map((rows, index) => {
            return (<tr key={index} style={{width: '20%'}}>
                {rows.map(item => {
                    return <td key={item.key} style={{overflow: 'hidden'}}>{item}</td>
                })}
            </tr>)
        });

        return <DragDropContext
            onDragEnd={this.onDragEnd}>
            <table style={{tableLayout: 'fixed'}}>
                <tbody>{columns}</tbody>
            </table>
        </DragDropContext>;
    }
}