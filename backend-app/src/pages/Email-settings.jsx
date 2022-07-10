import React, { useEffect, useState } from "react";
import style from './Email-settings.scss'

import ReactTooltip from "react-tooltip"

import TextInput from "../components/TextInput"
import firebase from "firebase";
import JoditEditor from "jodit-react"
import { Icon, InlineIcon } from "@iconify/react";
import lock from "@iconify/icons-mdi/lock"

const { __ } = window.wp.i18n;


const editor_config = {
    readonly: false, 
    height: 250
}
const editor = null


const EmailSettings = (props) => {
    let {config} = props
    return(
        <>
        <div className={style.emailSettingsWrap}>
            <div className={style.bodyWrap}>

                
            {/* Block this item from free version  */}
            <a target={`_blank`} href="https://wppluginia.com/product/learning-management-system-lms-chat-application-pro/" className={`${style.emailSettings} ${style.block}`} data-tip data-for="proFeatures">
                    <InlineIcon icon={lock} />
                    <ReactTooltip id="proFeatures" place="top" effect="solid">
                        {__('This is a pro feature, please use our pro version for use this feature.', 'lms-conversation')}
                    </ReactTooltip>
            </a>
                


                <h2>{__('Email sender options', 'lms-conversation')}</h2>
                <div className={style.row}>
                    <div>
                        {__('From Name', 'lms-conversation')}
                        <span data-tip data-for="fromName" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="fromName" place="right" effect="solid">
                                {__('How the sender name appears in outgoing LMSC emails.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </div>

                    <div>
                    <TextInput 
                        type="text"
                        onChange={props.handleUpdate}
                        name="from_name"
                        value={typeof config.from_name != 'undefined' ? config.from_name : ''}
                    />
                    </div>
                </div>

                <div className={style.row}>
                    <div>
                        {__('From Address', 'lms-conversation')}
                        <span data-tip data-for="fromAddress" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="fromAddress" place="right" effect="solid">
                                {__('How the sender email appears in outgoing LMSC emails.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </div>

                    <div>
                    <TextInput 
                        type="email"
                        onChange={props.handleUpdate}
                        name="from_email"
                        value={typeof config.from_email != 'undefined' ? config.from_email : ''}
                    />
                    </div>
                </div>

                <hr />
                <h2>{__('Email Settings', 'lms-conversation')}</h2>
                
                {/* Email notification to teacher for each single message */}
                <div>
                    <article>
                        {__('Email notification to Teacher', 'lms-conversation')}
                        <span data-tip data-for="sendMailNotificationToTeacher" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="sendMailNotificationToTeacher" place="top" effect="solid">
                                {__('If enabled, an email notification send to course author/teacher for each new message.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <label className={style.switch}>
                        <input type="checkbox" 
                            onChange={props.handleUpdate}
                            name="notification_to_teacher"
                            value={1}
                            checked={typeof config.notification_to_teacher != 'undefined' && config.notification_to_teacher ? true : false}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>

                {
                    (typeof config.notification_to_teacher != 'undefined' && config.notification_to_teacher) && (
                        <>
                            <div className={style.sub}>
                                <article>
                                    {__('Allow course author to disable mail notification', 'lms-conversation')}
                                    <span data-tip data-for="sendMailNotificationToTeacher" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                        <ReactTooltip id="sendMailNotificationToTeacher" place="top" effect="solid">
                                            {__('If enabled, an email notification send to course author/teacher for each new message.', 'lms-conversation')}
                                        </ReactTooltip>
                                    </span>
                                </article>

                                <label className={style.switch}>
                                    <input type="checkbox" 
                                        onChange={props.handleUpdate}
                                        name="capable_notification_disable"
                                        value={1}
                                        checked={typeof config.capable_notification_disable != 'undefined' && config.capable_notification_disable ? true : false}
                                    />
                                    <span className={style.slider}></span>
                                </label> 
                            </div>            
                        </>
                    )
                }


                <div className={style.row}>
                    <article>
                        {__('Allow course author send notification mail to student', 'lms-conversation')}
                        <span data-tip data-for="sendNotifiationToStudent" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="sendNotifiationToStudent" place="top" effect="solid">
                                {__('If enabled, teacher can capable to send mail notification when he/she is available.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <label className={style.switch}>
                        <input type="checkbox" 
                            onChange={props.handleUpdate}
                            name="teacher_can_send_notification"
                            value={1}
                            checked={typeof config.teacher_can_send_notification != 'undefined' && config.teacher_can_send_notification ? true : false}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>            
        

                {
                    (typeof config.teacher_can_send_notification != 'undefined' && config.teacher_can_send_notification) && (
                        <>
                            <div className={style.row}>
                                <div>
                                    {__('Email Subject', 'lms-conversation')}
                                    <span data-tip data-for="emailSubject" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                        <ReactTooltip id="emailSubject" place="top" effect="solid">
                                            {__('Firebase Application ID.', 'lms-conversation')}
                                        </ReactTooltip>
                                    </span>
                                </div>
                                <div>
                                    <TextInput 
                                        type="text"
                                        onChange={props.handleUpdate}
                                        name="email_subject"
                                        value={typeof config.email_subject != 'undefined' ? config.email_subject : ''}
                                    />
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className={`${style.row} ${style.emailbody}`}>
                                <div>
                                    {__('Email body', 'lms-conversation')}
                                    <span data-tip data-for="emailBody" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                        <ReactTooltip id="emailBody" place="top" effect="solid">
                                            {__('Email body for user notification which send by teacher', 'lms-conversation')}
                                        </ReactTooltip>
                                    </span>
                                </div>
                                <div>
                                    <JoditEditor
                                        ref={editor}
                                        value={typeof config.teacher_notification_email_body != 'undefined' ? config.teacher_notification_email_body : ''}
                                        config={editor_config}
                                        tabIndex={1} // tabIndex of textarea
                                        onChange={(newContent) => props.handleUpdate(newContent, 'teacher_notification_email_body')}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }





               

              

             

                <button className={style.saveBtn} onClick={props.SaveChanges}>
                    <span>{__('Save', 'lms-conversation')}</span>
                </button>
            </div>
        </div>
        </>
    )
}

export default EmailSettings;
