import {validate_paths} from "./api";

let i;
// TODO; Currently edits grid directly. It would be much safer to make a copy and return the copy.
function verify_paths(grid, source){
    let filenames = [];
    for(i = 1; i < grid.length; i++) {
        filenames.push(grid[i][0])
    }
    let data = {
        filenames: filenames,
        source: source,
    };

    return(validate_paths(data).then(response => compare_with_response(response, filenames)));
}

function compare_with_response(response, filenames){
    let valids = response.data.validations;

    for(i = 0; i < valids.length; i++) {
        filenames[i].verified = valids[i]
    }
    return(filenames);
}

function calculate_non_empty_rows(grid){
    let row, item;
    let result = 0;
    for(row = 1; row < grid.length; row++) {
        for(item = 0; item < grid[row].length; item++){
            if(grid[row][item].value !== '') {
                result++;
                break;
            }
        }
    }

    return result
}

export {verify_paths, calculate_non_empty_rows};