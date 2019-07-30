import React from 'react';

export default class Instructions extends React.Component {
    render() {
        return (
            <div>
                <h3>Instructions</h3>
                <ul>
                    <li>First, login to DSpace using the blue button up top.</li>
                    <li>Next, drag/select a csv file to upload.</li>
                    <li>Use the select folder button above to select the root folder of the photos.</li>
                    <li>Edit the data in the spreadsheet as needed.</li>
                    <li>The Column headers above the spreadsheet are draggable. Red means invalid, green means valid,
                        and yellow means valid, but unneeded.
                    </li>
                    <li>Once you are ready, click submit and confirm your submission.</li>
                    <li>Note: If any button of piece of this page is confusing, hover over it with your mouse for more information.</li>
                </ul>
            </div>
        );
    }

}