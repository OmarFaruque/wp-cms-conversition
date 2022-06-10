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
                                        <li>{__('For setup firebase settings you should go to ', 'lms-conversation')} <a href="https://firebase.google.com/" target="_blank">Firebase</a> {__(' and login with your gmail account.')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-1.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Press "Add project" if you want to start with a new database.', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-2.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Press "Authentication" from left menu and Enable "Email/Password" if it Disabled.', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-3.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Click on "Realtime Database" from left menu and then create a database by press create database button', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-4.jpg`} alt={__('firebase started')} />
                                        </li>

                                        <li>{__('In Realtime Database add following rules in "Rules" tab: ', 'lms-conversation')}<code>&#123;".read": true, ".write": true&#125;</code>
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-5.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Then go to "Storage" menu from left and write following code for save attachment and images.', 'lms-conversation')}<br/>{__('Code', 'lms-conversation')}: <code>rules_version = '2'; service firebase.storage &#123;match /b/&#123;bucket&#125;/o &#123;match /&#123;allPaths=**&#125; &#123;allow read, write: if request.auth != null;&#125;&#125;&#125;</code>
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-9.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Now press settings icon from the right side of "Project Overview" in top left corner and create a new app by click web app icon from bottom of the page', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-6.jpg`} alt={__('firebase started')} />
                                        </li>

                                        <li>{__('Write anything as your app name and press "Register now" button for process', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-7.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('Our journey are near end and end of the session now you can see all of your necessary information like API Key, Auth Domain etc. You should be use this information in firebase settings tab for run your "LMS Chat" application successfully.', 'lms-conversation')}
                                            <img src={`${window.lms_conversition_object.assets_url}images/firebase-8.jpg`} alt={__('firebase started')} />
                                        </li>
                                        <li>{__('If you fill up all information perfectly you will be see "Connected" as connection status', 'lms-conversation')}</li>
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
