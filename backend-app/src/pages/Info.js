import React from "react";
import style from './Info.scss'

import ReactTooltip from "react-tooltip"

import TextInput from "../components/TextInput"

const { __ } = window.wp.i18n;

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        }

    }

    render() {
        return (
            <>
                <div className={style.Wrap}>
                    <div className={style.bodyWrap}>
                        <h2>{__('Information', 'lms-conversation')}</h2>
                        <div className={style.inputWrap}>
                            
                            {/* API Key */}
                            <div className={style.row}>
                                <div>
                                    <strong>{__('For setup your firebase database, follow the below steps.', 'lms-conversation')}</strong>
                                    <span data-tip data-for="firebaseSettings" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                        <ReactTooltip id="firebaseSettings" place="top" effect="solid">
                                            {__('Firebase Settings Information', 'lms-conversation')}
                                        </ReactTooltip>
                                    </span>
                                </div>
                                <div>
                                    <ol>
                                        <li>{__('For setup firebase settings you should go to ', 'lms-conversation')} <a href="https://firebase.google.com/" target="_blank">Firebase</a> {__(' and login with your gmail account.')}</li>
                                        <li>{__('Press "Add project" if you want to start with a new project.', 'lms-conversation')}</li>
                                        <li>{__('Press "Authentication" from left menu and Enable "Email/Password" if Disabled.', 'lms-conversation')}</li>
                                        <li>{__('Press "Realtime Database" from left menu and then press "Rules" from top menu. Add rules:{".read": true, ".write": true} in "Edit Rules" window.', 'lms-conversation')}</li>
                                        <li>{__('At last step, you should press settings icon from the right side of "Project Overview" in top left corner.', 'lms-conversation')}</li>
                                        <li>{__('Scroll down and you can see necessary settings information for use your "Firebase Settings" tab', 'lms-conversation')}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


export default Info;
