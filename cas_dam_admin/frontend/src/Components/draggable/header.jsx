import React from 'react';
import styled from 'styled-components'
import {Draggable} from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid lightgrey
    padding: 16px;
    margin-right: 8px;
    background-color: white;
    userSelect: none;
`;

export default class Header extends React.Component {
    render() {
        return (

            <Draggable draggableId={this.props.header.id} index={this.props.index}>
                {provided => (
                    <Container
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