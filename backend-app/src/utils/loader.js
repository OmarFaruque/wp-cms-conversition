import React, { Component } from 'react';
import style from './loader.scss'


export default class Loader extends Component {

    render(){
        return (
            <div className={style.loader}>
                <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/loading.svg)`}} className={style.icon}></span>
            </div>
        )
    }
    
}