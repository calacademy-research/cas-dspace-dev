import {validate_paths} from "./api";

let i;

function verify_paths(grid, update_grid){
    let filenames = [];
    for(i = 1; i < grid.length-1; i++) {
        filenames.push(grid[i][0])
    }
    validate_paths(filenames).then(response => compare_with_response(response, filenames, update_grid));
}

function compare_with_response(response, filenames){
    let valids = response.data.validations;

    for(i = 0; i < valids.length; i++) {
        filenames[i].verified = valids[i]
    }
}

export {verify_paths};