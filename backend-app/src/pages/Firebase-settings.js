import React from "react";
import style from './Firebase-settings.scss'

import ReactTooltip from "react-tooltip"

import TextInput from "../components/TextInput"

const { __ } = window.wp.i18n;

class FirebaseSettings extends React.Component {
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
                                        onChange={this.props.handleUpdate}
                                        name="api_key"
                                        value={typeof this.props.config.api_key != 'undefined' ? this.props.config.api_key : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="auth_domain"
                                        value={typeof this.props.config.auth_domain != 'undefined' ? this.props.config.auth_domain : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="database_url"
                                        value={typeof this.props.config.database_url != 'undefined' ? this.props.config.database_url : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="projectid"
                                        value={typeof this.props.config.projectid != 'undefined' ? this.props.config.projectid : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="storage_bucket"
                                        value={typeof this.props.config.storage_bucket != 'undefined' ? this.props.config.storage_bucket : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="messaging_sender_id"
                                        value={typeof this.props.config.messaging_sender_id != 'undefined' ? this.props.config.messaging_sender_id : ''}
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
                                        onChange={this.props.handleUpdate}
                                        name="app_id"
                                        value={typeof this.props.config.app_id != 'undefined' ? this.props.config.app_id : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className={style.saveBtn} onClick={this.props.SaveChanges}>
                            <span>{__('Save', 'lms-conversation')}</span>
                        </button>
                    </div>
                </div>
            </>
        )
    }
}


export default FirebaseSettings;
