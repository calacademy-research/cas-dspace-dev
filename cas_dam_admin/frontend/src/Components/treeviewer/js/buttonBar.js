import React, {Fragment} from "react";
import {TreeExample} from './tree.js';
import {ModeSwitch} from "./modeSwitch.js";
import {UploadButton} from "./uploadButton.js";
import {ExitButton} from "./exitButton";
import '../css/tableStyle.css';
import Logger from '../../../logger.js'
import '../css/ExitButton.css';

/*
This Button Bar Component allows a central place
that controls all buttons and controls of the system.
It is the common parent among all input devices allowing
for easy transfer of data.
*/

class ButtonBar extends React.Component {

    /*
    The gcloud state is kept as a boolean for ease of use, especially
    with inverting value, and the upload state is nested such that passing down
    all the necessary information is easier.
     */

    constructor(props) {
        super(props);
        this.state = {
            gcloud: false,
            upload: {
                uploadType: 'local',
                upload: null
            }
        };

        /*
        The Two Call back functions that allow for the information to pass upstream.
         */

        this.switchState = this.switchState.bind(this);
        this.updateUpload = this.updateUpload.bind(this);

    }

    updateUpload(newState) {
        let type;
        let path_or_id;
        /*
        The file has to be checked for gcloud vs local so that it knows
        which api to use and what information it has to send it. For the
        google endpoint, an id is required. However, for the local endpoint,
        a full filepath is required.
         */

        if (newState.gcloud) {
            type = 'gcloud';
            path_or_id = newState.cursor.id
        } else {
            type = 'local';
            path_or_id = newState.cursor.filepath
            console.log(path_or_id);
        }

        if(newState.cursor.is_folder){
            this.setState({
            upload: {
                uploadType: type,
                upload: path_or_id,
                uploadName: newState.name,
            }
        });

        } else {
            Logger.info("File Was Selected");
        }
    }

    switchState(newState) {

        this.setState({
            gcloud: newState,
        })
    }

    render() {
        // The ButtonBar is formatted using an html table for ease
        // of use. However, the styling and spacing is lazy and inconsistent.
        return (
            <Fragment>
                <table className="table">
                    <tbody>
                    <tr>

                        <th>
                            <UploadButton upload={this.state.upload} closeModal={this.props.closeModal}
                                          setSelection={this.props.setSelection}/>
                        </th>

                        <th>
                            <div style={{paddingLeft: "50px"}}/>
                        </th>

                        <th>
                            <div className="label">
                                <h1> Local Drive </h1>
                            </div>
                        </th>

                        <th>
                            <ModeSwitch isChecked={this.state.gcloud} switchState={this.switchState}/>
                        </th>

                        <th>
                            <div className="label">
                                <h1> Google Drive </h1>
                            </div>
                        </th>

                        <th>
                            <div className="ExitButton-container">
                                <ExitButton closeModal={this.props.closeModal}/>
                            </div>
                        </th>

                    </tr>
                    </tbody>
                </table>
                <TreeExample gcloud={this.state.gcloud} cursorCallback={this.updateUpload}/>
            </Fragment>
        );
    }
}

export {ButtonBar};
