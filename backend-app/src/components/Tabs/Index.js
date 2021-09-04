import React from 'react'
import {NavLink, withRouter} from "react-router-dom";
import style from './style.scss'
import { Icon, InlineIcon } from "@iconify/react";
import cogOutline from "@iconify/icons-mdi/cog-outline";
import firebase from "@iconify/icons-mdi/firebase";
import info from "@iconify/icons-mdi/information";


const { __ } = window.wp.i18n;

const Tabs = (props) => {

    return (
        <div className={style.wrap}>
            <ul>
                <li>
                
                    <NavLink exact activeClassName={style.active} to="/">
                        <span className={style.icon}>
                            <InlineIcon icon={cogOutline} />
                        </span>
                        {__('General Settings', 'lms-conversation')}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName={style.active} to="/firebase-settings">
                        <span className={style.icon}>
                            <InlineIcon icon={firebase} />
                        </span>
                        {__('Firebase Settings', 'lms-conversation')}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName={style.active} to="/info">
                        <span className={style.icon}>
                            <InlineIcon icon={info} />
                        </span>
                        {__('Info', 'lms-conversation')}
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Tabs);
