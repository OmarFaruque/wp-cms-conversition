import React from "react";
import {HashRouter, Route, Routes} from 'react-router-dom'
import ReactDOM from "react-dom";
import FetchWP from './utils/fetchWP';
import Loader from './utils/loader';
import General from "./pages/General";
import FirebaseSettings from "./pages/Firebase-settings";
import Tabs from "./components/Tabs/Index.jsx";
import Info from "./pages/Info";
import Proadvertisement from "./components/Proadvertisement/Proadvertisement"
import EmailSettings from "./pages/Email-settings"

//CSS 
import style from './backend.scss';

const { __ } = window.wp.i18n;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            config: {}
        }

        this.fetchWP = new FetchWP({
            restURL: window.lms_conversition_object.root,
            restNonce: window.lms_conversition_object.api_nonce,
        });


        this.handleUpdate = this.handleUpdate.bind(this)
        this.SaveChanges = this.SaveChanges.bind(this)
    }


    componentDidMount() {
        this.fetchData();

    }

    componentWillUnmount() {

    }

    handleUpdate(e, name = false) {

        const {config} = this.state

        if(!name){
            switch(e.target.type){
                case 'checkbox':
                    config[e.target.name] = !config[e.target.name] ? true : false
                break;
                default:
                    config[e.target.name] = e.target.value
            }
        }else{
            config[name] = e
        }

        

        this.setState({
            config:config
        })
    }

    SaveChanges = () => {
        this.setState({
            loader: true
        });
        let {config} = this.state
        config = { ...config }

        let data = {
            config: config
        }
        
        this.fetchWP.post('save', data).then(json => {
            this.setState({
                loader: false
            });
        }).catch(error => {
            alert("Some thing went wrong");
        })
    }


    fetchData() {
        this.setState({
            loader: true,
        });

        this.fetchWP.get('config/')
            .then(
                (json) => {
                    this.setState({
                        loader: false,
                        config: json,
                    });
                });
    }

    render() {
        const {config, loader} = this.state;
        return (
            <div className={style.lmsWrap}>
                <div className={style.header}>
                    <div>
                        <h2>
                            <span>
                                {__('LMS Conversation', 'lms-conversation')}
                            </span>
                        </h2>
                    </div>
                    <div>
                        <a href="#">{__('Check Premium Options', 'lms-conversation')}</a>
                    </div>
                </div>
                <div className={style.bodyWrap}>
                    <div className={style.lmsBody}>
                    {
                            (() => {
                                if(loader){ return <Loader />}
                                else{
                                    return(
                                        <>
                                        <HashRouter>
                                            <Tabs/>
                                            <Routes>
                                                <Route
                                                    path="/"
                                                    element={
                                                        <General 
                                                            remove_all_message={this.remove_all_message}
                                                            config={config} 
                                                            handleUpdate={this.handleUpdate}
                                                            SaveChanges={this.SaveChanges}
                                                            />
                                                    }
                                                />
                                                <Route
                                                    path="/firebase-settings"
                                                    element={
                                                        <FirebaseSettings
                                                            handleUpdate={this.handleUpdate}
                                                            config={config}
                                                            SaveChanges={this.SaveChanges}
                                                        />
                                                    }
                                                />


                                                <Route
                                                    path="/info"
                                                    element={
                                                        <Info
                                                            handleUpdate={this.handleUpdate}
                                                            config={config}
                                                            SaveChanges={this.SaveChanges}
                                                        />
                                                    }
                                                />

                                                <Route
                                                    path="/email-settings"
                                                    element={
                                                        <EmailSettings
                                                            handleUpdate={this.handleUpdate}
                                                            config={config}
                                                            SaveChanges={this.SaveChanges}
                                                        />
                                                    }
                                                />
                                            </Routes>
                                        </HashRouter>
                                        </>
                                    )
                                }
                            })()
                        }

                    </div>
                    <Proadvertisement />
                </div>
                
            </div>
        )
    }

}


if (document.getElementById("lms_conversition_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("lms_conversition_ui_root"));
}

