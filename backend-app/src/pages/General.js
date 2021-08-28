import React from "react"
import style from './General.scss'
import ReactTooltip from "react-tooltip"

const { __ } = window.wp.i18n;

export default function General(props) {
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
                            name="enable_currency_switcher"
                            value={1}
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
                            name="enable_currency_switcher"
                            value={1}
                        />
                        <span className={style.slider}></span>
                    </label> 
                </div>

                <button onclick={props.saveHandler} ></button>
            </div>
        </div>
    </>
    )

}


