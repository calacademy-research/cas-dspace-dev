import axios from 'axios'

function sendJsonAsPost(url, data) {
    axios.post(url, data, {}).then(function (response) {
            if (response.status === 200) {
                console.log(response);
                return (response.response);
            } else {
                console.log(response.status);
                return response.status
            }
        }
    )
}

function getCollections(url) {
    console.log('get collections has been triggered')
    return axios.get(url)
}

export {sendJsonAsPost, getCollections};
// APIcall('/api/local/childrenSearch/', {
//     name: file.name,
//     is_folder: file.is_folder,
//     children: file.children,
//     filepath: file.filepath,
//   }
