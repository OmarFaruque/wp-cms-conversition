import { render, h, Component } from 'preact';
import FetchWP from './utils/fetchWP';
import chaticon from './icons/chat.svg';

//CSS 
import style from './frontend.scss';
import { sprintf, _n, __ } from '@wordpress/i18n';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }
        }

        this.fetchWP = new FetchWP({
            restURL: window.lms_conversition_object.root,
            restNonce: window.lms_conversition_object.api_nonce,

        });

    }


    componentDidMount() {
        // this.fetchData();

    }

    componentWillUnmount() {

    }

    handleUpdate(conf) {

        // this.setState({conf});
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
                <div className={style.chatWrap}>
                    <div className={style.chatIcon}>
                        <img src={`${window.lms_conversition_object.assets_url}images/${chaticon}`} alt={__('LMS Chat', 'lms-conversation')} />
                    </div>
                    <div className={style.chatWindow}>
                        <div className={style.chatBody}>
                            <div>
                                <ul>
                                    <li className={style.inbox}>
                                        <span></span>
                                    </li>
                                    <li className={style.inbox}>
                                        <span></span>
                                    </li>
                                    <li className={style.inbox}>
                                        <span></span>
                                    </li>
                                    <li className={style.inbox}>
                                        <span></span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div>
                                    <h2>{__('Messages', 'lms-conversation')}</h2>
                                    <div className={style.userList}>
                                        <ul>
                                            <li className={style.groupItem}>

                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
        )
    }

}


if (document.getElementById("lms_conversition_chat_ui")) {
    render(<App/>, document.getElementById("lms_conversition_chat_ui"));
}

