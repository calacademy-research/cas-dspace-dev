import { localRootFile, gRootFile } from './constants.js'

function API_gcloud_children(file=gRootFile){
  return APIcall('/api/google/childrenSearch/', {
  id: file.id,
  name: file.name,
  is_folder: file.is_folder,
  children: file.children,
});
}


function API_local_children(file=localRootFile){
  return APIcall('/api/local/childrenSearch/', {
    name: file.name,
    is_folder: file.is_folder,
    children: file.children,
    filepath: file.filepath,
  }
)
}

function APIcall(url, data) {
  var request = new XMLHttpRequest();
  request.open("POST", url, false);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(data));

  if (request.status === 200) {
    return(JSON.parse(request.response));
} else {
  console.log(request.status)
}


}

export { API_gcloud_children, API_local_children };
