import React from 'react';

export default class Instructions extends React.Component {
    render() {
        return (
            <div>
                <h3>Information</h3>
                <ul>
                    <li>Before Submitting, you must have at least 1 row filled in and be logged in to DSpace.</li>
                    <li>If a filename cell highlights in green, we were able to locate your file. </li>
                    <li>In the draggable Column headers, you may reorder columns, combine columns, or delete them.</li>
                    <li>If a draggable Column is green, it is in our schema and it was included in your csv. If it is grey, it is included in our scheme, but not your csv. And finally, if it is red, it is included in your csv, but not our schema. </li>
                </ul>
            </div>
        );
    }

}