import React, { Component } from 'react';
import style from './loader.scss'


export default class Loader extends Component {

    render(){
        return (
            <div className={style.loader}>
                <span className={style.icon}></span>
            </div>
        )
    }
    
}