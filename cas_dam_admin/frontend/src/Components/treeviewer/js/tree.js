import React, {useState} from "react";
import {Treebeard} from "react-treebeard";
import {API_gcloud_children, API_local_children} from './api.js';
import {DisplayBox} from './displayBox.js'
import '../css/treeStyle.scss';

/*
The datums are distinctly split into two variables because
the format of their trees is different and the function to expand
the tree is also different.
 */

let childrenSearchFunc;
let datum;

/*
Two variables are used to track the current mode, and the current
selection. All of this information is eventually passed
into the upload button.
 */

let gcloudState;
let uploadState;

const TreeExample = (props) => {
    /*
    Initiates Cursor so that selection can be tracked.
    Cursor stores the current selected part of datum
     */
    let [cursor, setCursor] = useState(null);

    const onToggle = (node, toggled) => {
        if (cursor) {
            cursor.active = false;
        }

        //node.active = true;

        if (node.children) {
            node.toggled = toggled;
            setCursor(node);
            cursor = node;
            node.active = true;
            setData(Object.assign({}, data));
        }

        // setCursor(node);
        // cursor = node;
        // setData(Object.assign({}, data));

        /*
        Uses a callback function to pass information
        back up to the upload button. A callback button is
        used in order to go upstream.
         */

        uploadState = {
            cursor: cursor,
            gcloud: props.gcloud,
            name: cursor.name,
        };
        props.cursorCallback(uploadState);

    };

    if (props.gcloud !== gcloudState) {
        if (props.gcloud) {
            childrenSearchFunc = API_gcloud_children;

        } else {
            childrenSearchFunc = API_local_children;
        }

        datum = childrenSearchFunc();
        cursor = datum;
        setCursor(datum);
        gcloudState = props.gcloud;
    }
    let [data, setData] = useState(datum);

    data = datum;

    if (cursor !== null && cursor !== undefined && cursor.is_folder) {
        const APIResponse = childrenSearchFunc(cursor);
        cursor.children = APIResponse.children

    }
    /*
    Tree object and Display Box are fragmented together to
    avoid another callback function and since there is really
    no reason to have the tree below the display box.
     */
    return (
        <React.Fragment>
            <div>
                <Treebeard
                    data={data}
                    onToggle={onToggle}
                    className="tree"
                />
            </div>

        </React.Fragment>
    );
};

export {TreeExample};
