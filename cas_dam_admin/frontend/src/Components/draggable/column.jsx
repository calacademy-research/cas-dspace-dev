import React from 'react';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Header from './header'

const Container = styled.div`
    // margin: 8px;
    // border: 1px solid lightgrey;
    // border-radius: 2px
`;
const Title = styled.h3`
    padding: 8px
`;
const HeaderList = styled.div`
    // padding: 8px;
    // display: flex;
    flex-wrap: wrap;
    text-align: center;
    
`;

export default class Column extends React.Component {
    render() {

        // let rows = this.props.column

        return (
            <Container>
                {/*<Title>{this.props.column.title}</Title>*/}
                <Droppable droppableId={this.props.column.id} isCombineEnabled={true}>
                    {(provided, snapshot) => (
                        <HeaderList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.headers.map((header, index) => {
                                return <Header key={header.id}
                                               header={header}
                                               index={(this.props.column.index) * 1 + index}    // TODO: make this independent of 5 (the chunking factor)
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