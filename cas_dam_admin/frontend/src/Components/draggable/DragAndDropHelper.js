export function generateDraggableData(grid) {
        /**
         * Generates a pair of objects: one contains the name and id of the header items, the other keeps track of their order
         */
        let headers = {};
        let columns = {
            'column-1': {
                id: 'column-1',
                title: 'Column headers',
                headerIds: [],
            }
        };
        let columnOrder = ['column-1'];

        grid[0].forEach((item, index) => {
            let content = item.value;
            let itemId = 'item-' + index.toString();

            headers[itemId] = {
                id: itemId,
                content: content
            };
            columns["column-1"].headerIds.push(itemId);

        });

        return {headers, columns, columnOrder}
    }