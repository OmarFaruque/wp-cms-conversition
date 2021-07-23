import React from 'react'
import {NavLink, withRouter} from "react-router-dom";
import style from './style.scss'
import { Icon, InlineIcon } from "@iconify/react";
import cogOutline from "@iconify/icons-mdi/cog-outline";


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
                    <NavLink exact activeClassName={style.active} to="/page2">Page 3 </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Tabs);
