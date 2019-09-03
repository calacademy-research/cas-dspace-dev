import React from 'react'
import {DragDropContext} from "react-beautiful-dnd";
import Column from "./column";

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
        const {destination, source, draggableId, combine} = result;

        if (!destination && !combine) {
            return;
        }

        if (combine || (destination.droppableId === source.droppableId &&
            destination.index === source.index)) {
            if (!combine) {

                return;
            }

        }

        const column = this.props.draggableData.columns[source.droppableId];
        const newHeaderIds = Array.from(column.headerIds);

        newHeaderIds.splice(source.index, 1);

        let sourceName = this.props.grid[0][source.index].value;

        if (combine) {
            let destinationName = this.props.draggableData.headers[combine.draggableId].content;

            // Don't combine if source and destination are both part of the schema
            if (this.isHeaderInSchema(sourceName) && this.isHeaderInSchema(destinationName)) {
                return
            }

            this.mergeColumns(sourceName, destinationName);

        } else {
            // Move old item to new position
            let destinationName = this.props.grid[0][destination.index].value;
            newHeaderIds.splice(destination.index, 0, draggableId);
            this.moveColumn(sourceName, destinationName)
        }

        // Update state of column
        const newColumn = {
            ...column,
            headerIds: newHeaderIds,
        };
        const newDraggableData = {
            ...this.props.draggableData,
            columns: {
                ...this.props.draggableData.columns,
                [newColumn.id]: newColumn,
            }
        };
        this.props.setDraggableData(newDraggableData);

    };

    getColumnIndexFromName(columnName) {
        return this.props.grid[0].findIndex(item => item.value === columnName);
    }

    isHeaderInSchema(name) {
        return this.props.metadataEntries.findIndex(item => item.value === name) >= 0;

    }

    render() {
        return <DragDropContext
            onDragEnd={this.onDragEnd}>
            {this.props.draggableData.columnOrder.map(columnId => {
                const column = this.props.draggableData.columns[columnId];
                const headers = column.headerIds.map(headerId => this.props.draggableData.headers[headerId]);
                return <Column key={column.id}
                               column={column}
                               headers={headers}
                               isHeaderInSchema={this.isHeaderInSchema}
                               grid={this.props.grid}/>;
            })}
        </DragDropContext>;
    }
}