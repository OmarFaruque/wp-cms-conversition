import React, {useState, useEffect} from "react";
import style from './Firebase-settings.scss'

import ReactTooltip from "react-tooltip"

import TextInput from "../components/TextInput"
import firebase from "firebase"

const { __ } = window.wp.i18n;

const FirebaseSettings = (props) => {
    const [connection_status, setConnection_status] = useState(false)
    const [firebase_login_method_status, setFirebase_login_method_status] = useState(true)

    useEffect(() => {
        firebase_connection_status()
    },[])




    /**
     * 
     * @param {firebase authontation} auth 
     * @return set login method true if successfully login
     */
     const firebase_check_login_method = (auth) => {
        auth.signInWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
        .then((userCredential) => {
            
        })
        .catch((error) => {
            if(error.code == 'auth/operation-not-allowed') 
                setFirebase_login_method_status(false)

            if(error.code == 'auth/wrong-password' || error.code == 'auth/invalid-email' || error.code == 'auth/user-not-found'){
                auth.createUserWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
                .then((userCredential) => {
                    setFirebase_login_method_status(true)
                })
                .catch((error) => {
                    let status = error.code == 'auth/email-already-in-use' ? true : false
                    setFirebase_login_method_status(status)
                })
            }
        })
    }


    const firebase_connection_status = () =>{
        if(typeof props.config.api_key != 'undefined'){
            let fconfig = {
                apiKey: props.config.api_key,
                authDomain: props.config.auth_domain,
                databaseURL: props.config.database_url,
                projectId: props.config.projectid,
                storageBucket: props.config.storage_bucket,
                messagingSenderId: props.config.messaging_sender_id,
                appId: props.config.app_id
            };

            
            if(!firebase.apps.length)
                firebase.initializeApp(fconfig);
             

            let database = firebase.database();
            let auth = firebase.auth();
            database.ref('.info/connected').on('value', function(snapshot) {
                    setConnection_status(snapshot.val())
                    firebase_check_login_method(auth)
            });
        }
    }
    return (
        <>
            <div className={style.Wrap}>
                <div className={style.bodyWrap}>
                    <h2>{__('Firebase Settings', 'lms-conversation')}</h2>
                    <div className={style.inputWrap}>
                        
                        {/* API Key */}
                        <div className={style.row}>
                            <div>
                                {__('API Key', 'lms-conversation')}
                                <span data-tip data-for="firebaseApiKey" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="firebaseApiKey" place="top" effect="solid">
                                        {__('Firebase API Key.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="api_key"
                                    value={typeof props.config.api_key != 'undefined' ? props.config.api_key : ''}
                                />
                            </div>
                        </div>

                        {/* Auth Domain */}
                        <div className={style.row}>
                            <div>
                                {__('Auth Domain', 'lms-conversation')}
                                <span data-tip data-for="authDomain" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="authDomain" place="top" effect="solid">
                                        {__('Firebase API Key.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="auth_domain"
                                    value={typeof props.config.auth_domain != 'undefined' ? props.config.auth_domain : ''}
                                />
                            </div>
                        </div>

                        {/* Database Url */}
                        <div className={style.row}>
                            <div>
                                {__('Database URL', 'lms-conversation')}
                                <span data-tip data-for="databaseUrl" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="databaseUrl" place="top" effect="solid">
                                        {__('Firebase Database Url.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="database_url"
                                    value={typeof props.config.database_url != 'undefined' ? props.config.database_url : ''}
                                />
                            </div>
                        </div>

                        {/* Project ID */}
                        <div className={style.row}>
                            <div>
                                {__('Project ID', 'lms-conversation')}
                                <span data-tip data-for="projectID" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="projectID" place="top" effect="solid">
                                        {__('Firebase Project ID.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="projectid"
                                    value={typeof props.config.projectid != 'undefined' ? props.config.projectid : ''}
                                />
                            </div>
                        </div>

                        {/* storage bucket */}
                        <div className={style.row}>
                            <div>
                                {__('Storage Bucket', 'lms-conversation')}
                                <span data-tip data-for="storage_bucket" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="storage_bucket" place="top" effect="solid">
                                        {__('Firebase Storage Bucket.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="storage_bucket"
                                    value={typeof props.config.storage_bucket != 'undefined' ? props.config.storage_bucket : ''}
                                />
                            </div>
                        </div>


                        {/* Messaging Sender ID */}
                        <div className={style.row}>
                            <div>
                                {__('Messaging Sender ID', 'lms-conversation')}
                                <span data-tip data-for="messaging_sender_id" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="messaging_sender_id" place="top" effect="solid">
                                        {__('Firebase Messaging Sender ID.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="messaging_sender_id"
                                    value={typeof props.config.messaging_sender_id != 'undefined' ? props.config.messaging_sender_id : ''}
                                />
                            </div>
                        </div>


                        {/* APP ID */}
                        <div className={style.row}>
                            <div>
                                {__('App ID', 'lms-conversation')}
                                <span data-tip data-for="app_id" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                    <ReactTooltip id="app_id" place="top" effect="solid">
                                        {__('Firebase Application ID.', 'lms-conversation')}
                                    </ReactTooltip>
                                </span>
                            </div>
                            <div>
                                <TextInput 
                                    type="text"
                                    onChange={props.handleUpdate}
                                    name="app_id"
                                    value={typeof props.config.app_id != 'undefined' ? props.config.app_id : ''}
                                />
                            </div>
                        </div>


                        <div className={style.row}>
                        <div>
                            {__('Connection Status', 'lms-conversation')}
                            <span data-tip data-for="connectionStatus" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                <ReactTooltip id="connectionStatus" place="right" effect="solid">
                                    {__('Firebase connection status.', 'lms-conversation')}
                                </ReactTooltip>
                            </span>
                        </div>
                        <div>
                            <div className={style.connectedStatus}>
                                {
                                    (() => {
                                        if(!connection_status){
                                            return(
                                                <>
                                                    <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/disconnected.png)`}}>
                                                        {__('Disconnected', 'lms-conversation')}
                                                    </span>                    
                                                </>
                                            )
                                        }else{
                                            return(
                                                <>
                                                    <span className={style.connected} style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/connected.png)`}}>
                                                        {__('Connected', 'lms-conversation')}
                                                    </span>                    
                                                    {
                                                        !firebase_login_method_status && (
                                                            <>
                                                                <span className={style.methodMsg}>{__('Firebase authentication sign-in method aren\'t set properly, please set Email/Password as sign-in method. Read info. (information) tab for more instruction.' )}</span>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    })()
                                }
                            </div>
                        </div>
                    </div>
                    </div>

                    <button className={style.saveBtn} onClick={props.SaveChanges}>
                        <span>{__('Save', 'lms-conversation')}</span>
                    </button>
                </div>
            </div>
        </>
    )
}


export default FirebaseSettings;
