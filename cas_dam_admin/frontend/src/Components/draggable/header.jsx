import React from 'react';
import styled from 'styled-components'
import {Draggable} from 'react-beautiful-dnd';


function isColumnEmpty(col, grid) {
    let i;
    for (i = 1; i < grid.length - 1; i++) {
        if (grid[i][col].value !== '') {
            return false
        }
    }
    return true

}

function determineColor(isInSchema, isCombineTargetFor, grid, index){
    if (isCombineTargetFor) {
        return '#B0DBAF'
    }
    if(isColumnEmpty(index, grid)){
        return '#e8e8e8'
    }

    if(isInSchema){
        return "#B0DBAF"
    } else {
        return "#E8A2A2"
    }
}

const Container = styled.div`
    border: 1px solid lightgrey
    padding: 16px;
    margin-right: 8px;
    border-radius: 25px;
    background-color: ${props => determineColor(props.isInSchema, props.isCombineTargetFor, props.grid, props.index)};
    userSelect: none;
    margin: 5px
`;

export default class Header extends React.Component {
    render() {
        return (

            <Draggable draggableId={this.props.header.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <Container isInSchema={this.props.isInSchema}
                               isCombineTargetFor={snapshot.combineTargetFor}
                               grid={this.props.grid}
                               index={this.props.index}
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               ref={provided.innerRef}
                    >
                        {this.props.header.content}
                    </Container>
                )}
            </Draggable>
        );
    }

}