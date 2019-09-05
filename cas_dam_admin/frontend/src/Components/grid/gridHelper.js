export function createEmptyGrid(metadataEntries) {
    /**
     * Creates a new grid that uses all of the metadata fields and an empty row beneath it
     * @returns {Object.<string>[][]} an array of two rows: the header row and an empty row
     */

    let grid = [];
    let headerRow = [];

    // Populate first row of grid with value of each metadata entry
    metadataEntries.forEach(entry => headerRow.push({value: entry.value}));

    grid.push(headerRow);
    grid.push(generateEmptyGridRow(grid));
    return grid
}

export function generateEmptyGridRow(grid) {
    /** Return an empty row (an array of objects with empty strings) that's the same width as the grid
     * @param {Object.<string>[][]} grid the grid to match sizes with
     *
     * @returns {Object.<string>[]} an array of objects with empty strings
     */


        // TODO: Currently sets all columns to verified false. Not super important but unneeded.
    let newArray = Array(grid[0].length).fill({value: ""});
    newArray[0].verified = false;
    return newArray;   // Generate an row with the same

}

export function generateGridJson(grid, collectionUuid, folderSource, sourcePath, email, password) {
    // Convert cell structure to proper JSON
    let jsonData = [];
    let headerRow = grid.shift();   // Remove header row, as we will be applying it to each of the subsequent rows

    // We convert from a grid format where the headers are one row and the data is in rows below it to an array
    // of objects. In each object, the header for the column is they key, and the cell data is the value.

    grid.forEach((row) => {
        let result = {};
        headerRow.forEach((item, itemIndex) => {
            if (~this.metadataEntries.findIndex(metadata => metadata.value === item.value)) {
                // Ignore empty cells
                console.log(item);
                if (row[itemIndex].value !== "") {
                    result[item.value] = row[itemIndex].value
                }
            }
        });
        jsonData.push(result)
    });

    // The last row will always be an empty, so we remove it before sending to the backend
    jsonData.pop();

    // dspaceConfig is the header that contains properties that apply to every item in the array.
    // folderSource defines where the files will come from: gdrive or slevin
    // sourcePath is the path to the closest common directory shared between all the files.
    let dspaceConfig = {
        collectionUuid: collectionUuid,
        folderSource: folderSource,
        sourcePath: sourcePath,
        email: email,
        password: password,

    };

    // Insert the config at the beginning of the array to be sent to the server
    jsonData.unshift(dspaceConfig);
    return jsonData
}

export function isLastGridRowEmpty(grid) {
    /**
     * Sees if the last row in the grid is empty (contains only empty strings)
     *
     * @returns {bool} True if the last row is empty, false if there is a non-empty string
     */
    let lastRow = grid[grid.length - 1];

    return (lastRow.some(cell => cell.value !== ""))
}

export function calculateNonEmptyRows(grid) {
    let row, item;
    let result = 0;
    for (row = 1; row < grid.length; row++) {
        for (item = 0; item < grid[row].length; item++) {
            if (grid[row][item].value !== '') {
                result++;
                break;
            }
        }
    }

    return result
}