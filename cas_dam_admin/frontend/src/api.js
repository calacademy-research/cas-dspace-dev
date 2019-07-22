import axios from 'axios'

function sendJsonAsPost(url, data) {
    return axios.post(url, data)
}

function getCollections(url) {
    return axios.get(url)
}

function validate_paths(data){
    return axios.post('/api/validate_paths', data)
}

export {sendJsonAsPost, getCollections, validate_paths};

