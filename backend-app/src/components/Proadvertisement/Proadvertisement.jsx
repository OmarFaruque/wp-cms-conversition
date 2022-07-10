import React from "react";
import style from './Proadvertisement.scss'

const { __ } = window.wp.i18n;

const liStyle = {
    backgroundImage: `url(${window.lms_conversition_object.assets_url}images/right-icon.svg)`
}

const Proadvertisement = (props) => {
    return(
        <>
            <div className={style.proAdvertisementWrap}>
                <div className={style.bodyWrap} style={{background: `url(${window.lms_conversition_object.assets_url}images/upgrade-bg.svg), linear-gradient(180deg, #21AEFD 0.19%, #006FFF 100%)`}}>
                    <a className={style.topUpgrade} href="https://wppluginia.com/product/learning-management-system-lms-chat-application-pro/" target="_blank">
                        {__('Upgrade', 'advanced-table-rate-shipping-for-woocommerce')}
                    </a>
                    <h2>{__('Upgrade to Pro version Now!', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
                    <p>{__('Thanks for using our plugin want more options? Consider Upgrading to our pro version', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                    <ul>
                        <li><span style={liStyle}></span>{__('Unlimited user can join course live chat, in free version, upto 10 user can chat.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Option to delete entire message.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Option to allow course author to delete entire message of a course.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Option to send email notification to teacher on personal message.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Allow teacher to send email notification to all participant using pre built content.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Allow teacher to set a chat start and duration time, then a countdown will appear in chat window before start.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('Option to set message before start and after end if teacher set start time.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                        <li><span style={liStyle}></span>{__('And many more...', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    </ul>
                    <a href="https://wppluginia.com/product/learning-management-system-lms-chat-application-pro/" target="_blank" >
                        {__('Upgrade now', 'advanced-table-rate-shipping-for-woocommerce')}
                        &nbsp;<span className="dashicons dashicons-arrow-right-alt2"></span>
                    </a>
                </div>
                <div className={style.ratingRequest}>
                    <span>{__('Please rate', 'lms-conversation')} <a target={`_blank`} href="https://wordpress.org/support/plugin/lms-chat/reviews/#new-post">{__('LMS Chat', 'lms-conversation')}</a> {__('for more feature in future.', 'lms-conversation')}</span>
                </div>
            </div>

          
        </>
    )
}

export default Proadvertisement





