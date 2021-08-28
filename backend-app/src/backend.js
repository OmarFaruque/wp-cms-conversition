import React from "react";
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom";
import FetchWP from './utils/fetchWP';
import General from "./pages/General";
import FirebaseSettings from "./pages/Firebase-settings";
import Tabs from "./components/Tabs";

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

    }


    componentDidMount() {
        this.fetchData();

    }

    componentWillUnmount() {

    }

    handleUpdate(e) {
        const {config} = this.state
        config[e.target.name] = e.target.value

        this.setState({
            config:config
        })
    }

    SaveChanges = () => {

        const {config} = this.state;
        this.fetchWP.post('save', {'config': config}).then(json => {

        }).catch(error => {
            alert("Some thing went wrong");
        })
    }


    fetchData() {
        this.setState({
            loader: true,
        });

        // this.fetchWP.get('config/')
        //     .then(
        //         (json) => {
        //             this.setState({
        //                 loader: false,
        //                 config: json,
        //             });
        //         });


    }

    render() {
        const {config} = this.state;
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
                <div className={style.lmsBody}>
                    <HashRouter>
                        <Tabs/>
                        <Switch>
                            <Route
                                path="/"
                                exact
                                render={props =>
                                    <General config={config} handleUpdate={this.handleUpdate}/>
                                }
                            />
                            <Route
                                exact
                                path="/firebase-settings"
                                render={props =>
                                    <FirebaseSettings
                                        handleUpdate={this.handleUpdate}
                                        config={config}
                                    />
                                }
                            />
                        </Switch>
                    </HashRouter>
                </div>
            </div>
        )
    }

}


if (document.getElementById("lms_conversition_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("lms_conversition_ui_root"));
}

