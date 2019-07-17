import axios from 'axios'

function sendJsonAsPost(url, data) {
    return axios.post(url, data)
}

function getCollections(url) {
    return axios.get(url)
}

function validate_paths(data){
    return axios.post('http://localhost:8000/api/validate_paths', data)
}

export {sendJsonAsPost, getCollections, validate_paths};
// APIcall('/api/local/childrenSearch/', {
//     name: file.name,
//     is_folder: file.is_folder,
//     children: file.children,
//     filepath: file.filepath,
//   }
