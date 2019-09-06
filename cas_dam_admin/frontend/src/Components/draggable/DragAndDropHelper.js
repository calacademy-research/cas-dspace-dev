export function generateDraggableData(grid) {
    /**
     * Generates a pair of objects: one contains the name and id of the header items, the other keeps track of their order
     */

    let numberOfItems = grid[0].length;

    let columnOrder = [];
    let headers = {};
    let columns = {};

    for (let i = 0; i < numberOfItems; i++) {
        columns['column-' + i.toString()] = {
            id: 'column-' + i.toString(),
            index: i,
            headerIds: [],
        };

        columnOrder.push('column-' + i.toString())
    }

    grid[0].forEach((item, itemIndex) => {
        let content = item.value;
        let itemId = 'item-' + (itemIndex).toString();

        headers[itemId] = {
            id: itemId,
            content: content
        };

        columns["column-" + itemIndex.toString()].headerIds.push(itemId)
    });

    return {headers, columns, columnOrder}
}