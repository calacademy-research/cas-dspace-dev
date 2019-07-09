import React, { useState } from "react";
import { Treebeard } from "react-treebeard";
import { API_gcloud_children, API_local_children } from './api.js';
import { style } from './style.js'
// import { datum } from './testData.js'
import { DisplayBox } from './displayBox.js'

const gcloudDatum = API_gcloud_children()
const localDatum = API_local_children()

var childrenSearchFunc = API_gcloud_children;
let datum = gcloudDatum;
var gcloudState = true;

const TreeExample = (props) => {
  console.log('Tree rendered!')
  var [cursor, setCursor] = useState(null);

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));
  };

  if(props.gcloud !== gcloudState) {
    if(props.gcloud){
      datum = gcloudDatum;
      childrenSearchFunc = API_gcloud_children;

    } else {
      datum = localDatum;
      childrenSearchFunc = API_local_children;
    }
    
    cursor = datum;
    setCursor(datum);
    gcloudState = props.gcloud
  }
  var [data, setData] = useState(datum);
  data = datum

  if(cursor !== null && cursor.is_folder) {

    const APIResponse = childrenSearchFunc(cursor)

    if (APIResponse.updated) {
      cursor.children = APIResponse.children
    }
  }
  return (
    <React.Fragment>
      <div>
        <Treebeard
          data={data}
          onToggle={onToggle}
          style={style}
        />
      </div>
      <DisplayBox
        data={cursor}
      />

    </React.Fragment>
  );
};

export { TreeExample };