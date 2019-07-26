import React from 'react';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Header from './header'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px
`;
const Title = styled.h3`
    padding: 8px
`;
const HeaderList = styled.div`
    padding: 8px;
    display: flex;
    
`;

export default class Column extends React.Component {
    render() {
        return (
            <Container>
                <Title>{this.props.column.title}</Title>
                <Droppable droppableId={this.props.column.id} isCombineEnabled direction='horizontal'>
                    {provided => (
                        <HeaderList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.headers.map((header, index) => <Header key={header.id} header={header}
                                                                               index={index}/>)}
                            {provided.placeholder}
                        </HeaderList>
                    )}
                </Droppable>
            </Container>
        )
    }
}