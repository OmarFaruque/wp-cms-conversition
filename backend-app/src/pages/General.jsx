import React, {useState} from "react"
import style from './General.scss'
import ReactTooltip from "react-tooltip"
import TextInput from "../components/TextInput"
import { Icon, InlineIcon } from "@iconify/react"
import trash from "@iconify/icons-mdi/trash-can-outline"
import lock from "@iconify/icons-mdi/lock"

const { __ } = window.wp.i18n;

const soundsFiles = {
    '': __('No Sound', 'lms-conversation'),
    'juntos-607.mp3' : __('Juntos', 'lms-conversation'), 
    'me-too-603.mp3' : __('Me-too', 'lms-conversation'),
    'mixkit-doorbell-single-press-333.wav' : __('Doorbell Single Press', 'lms-conversation'),
    'mixkit-dry-pop-up-notification-alert-2356.wav' : __('Dry Pop-up Notification Alert', 'lms-conversation'),
    'mixkit-elevator-tone-2863.wav' : __('Elevator Tone', 'lms-conversation'),
    'mixkit-gaming-lock-2848.wav' : __('Gaming Lock', 'lms-conversation'),
    'mixkit-sci-fi-click-900.wav' : __('Sci Fi Click', 'lms-conversation'),
    'mixkit-sci-fi-reject-notification-896.wav' : __('Sci Fi Reject Notification', 'lms-conversation'),
    'mixkit-software-interface-back-2575.wav': __('Software Interface Back', 'lms-conversation'),
    'mixkit-software-interface-remove-2576.wav': __('Software Interface Remove', 'lms-conversation'),
    'mixkit-store-door-bell-ring-934.wav': __('Store Door Bell Ring', 'lms-conversation'),
    'percussion-sound-614.mp3': __('Percussion Sound', 'lms-conversation')
}

export default function General(props) {
    const [delete_status, setDelete_status] = useState(false)
    const {config} = props;
    
    return (
    <>
    <div className={style.generalWrap}>
            <div className={style.bodyWrap}>
                <h2>{__('General Settings', 'lms-conversation')}</h2>
                
                {/* Enable LMS conversation */}
                <div>
                    <article>
                        {__('Enable LMS Conversation', 'lms-conversation')}
                        <span data-tip data-for="enableConversation" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="enableConversation" place="top" effect="solid">
                                {__('Enable / Disable LMS Conversation for Fornt-end.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <label className={style.switch}>
                        <input type="checkbox" 
                            onChange={props.handleUpdate}
                            name="enable_lms_conversation"
                            value={1}
                            checked={typeof config.enable_lms_conversation != 'undefined' && config.enable_lms_conversation ? true : false}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>

                {/* Allow Teacher to enable / disable each course conversation */}
                <div>
                    <article>
                        {__('Conversation Controller on Course', 'lms-conversation')}
                        <span data-tip data-for="teahcerCapability" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="teahcerCapability" place="top" effect="solid">
                                {__('Allow Teacher / Author to set Enable / Disable conversation for each course.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <label className={style.switch}>
                        <input type="checkbox" 
                            onChange={props.handleUpdate}
                            name="allow_tacher_capability"
                            value={1}
                            checked={typeof config.allow_tacher_capability != 'undefined' && config.allow_tacher_capability ? true : false}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>

                {/* Allow user to remove message */}
                <div>
                    <article>
                        {__('Allow user to remove own message', 'lms-conversation')}
                        <span data-tip data-for="removeownmessage" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="removeownmessage" place="top" effect="solid">
                                {__('Allow chat user to remove their own message.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <label className={style.switch}>
                        <input type="checkbox" 
                            onChange={props.handleUpdate}
                            name="remove_access"
                            value={1}
                            checked={typeof config.remove_access != 'undefined' && config.remove_access ? true : false}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>


                {/* Notification Sound */}
                <div>
                    <article>
                        {__('Notification Sound', 'lms-conversation')}
                        <span data-tip data-for="notificationSound" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="notificationSound" place="top" effect="solid">
                                {__('Set notification sound for while receive message.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </article>

                    <TextInput
                        type="select"
                        options={soundsFiles}
                        name="notifucation_sound"
                        onChange={props.handleUpdate}
                        value={typeof config.notifucation_sound != 'undefined' ? config.notifucation_sound : ''}
                    /> 
                </div>




                <div className={style.erashedWrap}>
                    <div className={style.blockedForFreeVersion}>
                        <span data-tip data-for="proFeatures">
                            <InlineIcon icon={lock} />
                            <ReactTooltip id="proFeatures" place="top" effect="solid">
                                {__('This is a pro feature, please use our pro version for use this feature.', 'lms-conversation')}
                            </ReactTooltip>
                        </span>
                    </div>
                    <hr/>
                    <h2>
                        {__('Erased', 'lms-conversation')}
                        <span>({__('Danger Zone', 'lms-conversation')})</span>
                    </h2>
                    <div>
                        <article>
                            {__('Allow author to remove course chat message', 'lms-conversation')}
                            <span data-tip data-for="removecourseMssage" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                <ReactTooltip id="removecourseMssage" place="right" effect="solid">
                                    {__('If selected, course author well be capable to remove all message from their own course.', 'lms-conversation')}
                                </ReactTooltip>
                            </span>
                        </article>

                        <label className={style.switch}>
                            <input type="checkbox" 
                                onChange={props.handleUpdate}
                                name="author_can_remove"
                                value={1}
                                checked={typeof config.author_can_remove != 'undefined' && config.author_can_remove ? true : false}
                            />
                            <span className={style.slider}></span>
                        </label> 
                    </div>

                    <div>
                        <article>
                            {__('Remove entire message', 'lms-conversation')}
                            <span data-tip data-for="removeEntireMessage" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                <ReactTooltip id="removeEntireMessage" place="right" effect="solid">
                                    {__('Remove entire message by pressing remove button', 'lms-conversation')}
                                </ReactTooltip>
                            </span>
                        </article>

                        <div className={style.removeAllMessage}>
                            <span data-tip data-for="removeWarning" onClick={(e) => remove_all_message(e)} className={style.removButton}>
                                <InlineIcon icon={trash} />
                                <ReactTooltip id="removeWarning" place="left" effect="solid">
                                    {__('WARNING: Remove entire message', 'lms-conversation')}
                                </ReactTooltip>
                            </span>
                            {
                                delete_status && (
                                    <>
                                        <span className={style.statusMessage}>
                                            {__('Entire message remove successfully.', 'lms-conversation')}
                                        </span>        
                                    </>
                                )
                            }
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


