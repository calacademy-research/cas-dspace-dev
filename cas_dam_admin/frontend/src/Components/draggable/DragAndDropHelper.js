import _ from 'lodash'

export function generateDraggableData(grid) {
    /**
     * Generates a pair of objects: one contains the name and id of the header items, the other keeps track of their order
     */

    // Count number of headers

    let numberOfItems = grid[0].length;
    let numberOfRows = Math.ceil(numberOfItems/1);

    let columnOrder = [];
    let headers = {};
    let columns = {};

    for (let i = 0; i < numberOfRows; i++) {
        columns['column-'+ i.toString()] = {
            id: 'column-'+ i.toString(),
            index: i,
            headerIds: [],
        };

        columnOrder.push('column-'+ i.toString())
    }

    // let headers = {};
    // let columns = {
    //     'column-1': {
    //         id: 'column-1',
    //         title: 'Column headers',
    //         headerIds: [],
    //     }
    // };
    // let columnOrder = ['column-1'];

    //TODO be more flexible with chunking, try to fit as many as possible on each row
    _.chunk(grid[0], 1).forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
            let content = item.value;
            let itemId = 'item-' + (rowIndex * 1 + itemIndex).toString();

            headers[itemId] = {
                id: itemId,
                content: content
            };

            columns["column-" + rowIndex.toString()].headerIds.push(itemId)
        })
    });

    // grid[0].forEach((item, index) => {
    //     let content = item.value;
    //     let itemId = 'item-' + index.toString();
    //
    //     headers[itemId] = {
    //         id: itemId,
    //         content: content
    //     };
    //     columns["column-1"].headerIds.push(itemId);
    //
    // });

    return {headers, columns, columnOrder}
}