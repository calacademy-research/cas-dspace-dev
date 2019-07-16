import axios from 'axios'

function sendJsonAsPost(url, data) {
    return axios.post(url, data)
}

function getCollections(url) {
    return axios.get(url)
}

export {sendJsonAsPost, getCollections};
// APIcall('/api/local/childrenSearch/', {
//     name: file.name,
//     is_folder: file.is_folder,
//     children: file.children,
//     filepath: file.filepath,
//   }
