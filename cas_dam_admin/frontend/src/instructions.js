import React from 'react';

export default class Instructions extends React.Component {
    render() {
        return (
            <div>
                <h3>Notes</h3>
                <p>You must be logged in to Submit items to DSpace. </p>
                <p>When a CSV file is loaded, its column names are displayed with red or green labels. </p>
                <p>Green labels will be submitted to Dspace. </p>
                <p>Red labels will not.</p>
                <p>Dragging a red label over its grey counterpart will turn it green. </p>
                <p>Files listed in green have been located on the server and are ready to be submitted.</p>
            </div>
        );
    }
}