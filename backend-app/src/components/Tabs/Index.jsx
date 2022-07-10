import React from 'react'
import {NavLink, useLocation} from "react-router-dom";
import style from './style.scss'
import { Icon, InlineIcon } from "@iconify/react";
import cogOutline from "@iconify/icons-mdi/cog-outline";
import firebase from "@iconify/icons-mdi/firebase";
import info from "@iconify/icons-mdi/information";
import emailIcon from "@iconify/icons-mdi/email";

import ReactTooltip from "react-tooltip"


const { __ } = window.wp.i18n;

const Tabs = (props) => {
    const location = useLocation()
    return (
        <div className={style.wrap}>
            <ul>
                <li>
                
                    <NavLink className={({ isActive }) => location.pathname == '/' ? style.active : ''} to="/">
                        <span className={style.icon}>
                            <InlineIcon icon={cogOutline} />
                        </span>
                        {__('General Settings', 'lms-conversation')}
                    </NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => location.pathname == '/firebase-settings' ? style.active : ''} to="/firebase-settings">
                        <span className={style.icon}>
                            <InlineIcon icon={firebase} />
                        </span>
                        {__('Firebase Settings', 'lms-conversation')}
                    </NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => location.pathname == '/email-settings' ? style.active : ''} to="/email-settings">
                        <span className={style.icon}>
                            <InlineIcon icon={emailIcon} />
                        </span>
                        {__(' Email Settings', 'lms-conversation')}
                    </NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => location.pathname == '/info' ? style.active : ''} to="/info">
                        <span className={style.icon}>
                            <InlineIcon icon={info} />
                        </span>
                        {__('Firebase Guideline', 'lms-conversation')}
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Tabs;
