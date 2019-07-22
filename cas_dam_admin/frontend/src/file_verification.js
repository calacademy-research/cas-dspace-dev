import {validate_paths} from "./api";

let i;
// TODO; Currently edits grid directly. It would be much safer to make a copy and return the copy.
function verify_paths(grid, source){
    let filenames = [];
    for(i = 1; i < grid.length-1; i++) {
        filenames.push(grid[i][0])
    }
    let data = {
        filenames: filenames,
        source: source,
    };

    validate_paths(data).then(response => compare_with_response(response, filenames));
}

function compare_with_response(response, filenames){
    let valids = response.data.validations;

    for(i = 0; i < valids.length; i++) {
        filenames[i].verified = valids[i]
    }
}

export {verify_paths};