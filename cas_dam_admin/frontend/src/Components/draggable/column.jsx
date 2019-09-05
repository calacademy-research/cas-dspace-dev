import React from 'react';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Header from './header'

const Container = styled.div``;

const HeaderList = styled.div`
    flex-wrap: wrap;
    text-align: center;
`;

export default class Column extends React.Component {
    render() {

        return (
            <Container>
                <Droppable droppableId={this.props.column.id} isCombineEnabled={true}>
                    {(provided, snapshot) => (
                        <HeaderList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.headers.map(header => {
                                return <Header key={header.id}
                                               header={header}
                                               index={this.props.column.index}
                                               isInSchema={this.props.isHeaderInSchema(header.content)}
                                               grid={this.props.grid}/>
                            })}
                            {provided.placeholder}
                        </HeaderList>
                    )}
                </Droppable>
            </Container>
        )
    }
}