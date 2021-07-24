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
                                <div className={style.profileInfo}>
                                    <div className={style.profileImg}></div>
                                    <h4>{__('Student Name', 'lms-conversation')}</h4>
                                    <p>{__('Student', 'lms-conversation')}</p>
                                </div>
                                <ul>
                                    <li className={style.inbox}>
                                        <span></span>
                                    </li>
                                    <li className={style.friends}>
                                        <span></span>
                                    </li>
                                    
                                </ul>
                            </div>
                            <div>
                                <div>
                                    <div className={style.listHeader}>
                                        <h2>{__('Messages', 'lms-conversation')}</h2>
                                        <div className={style.searchbar}>
                                            <div>
                                                <input type="search" name="search" id="search" placeholder={__('Search', 'lms-conversation')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.userList}>
                                        <div>
                                            <div>
                                                <div className={style.userImg}></div>
                                            </div>
                                            <div>
                                                <h4>{__('Group Chat', 'lms-conversation')}</h4>
                                                <h5>{__('Student', 'lms-conversation')}</h5>
                                                <p>{__('Really? That\'s greet...', 'lms-conversation')}</p>
                                            </div>
                                            <div>
                                                <span>2:34pm</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <div className={style.userImg}></div>
                                            </div>
                                            <div>
                                                <h4>{__('Student Name', 'lms-conversation')}</h4>
                                                <h5>{__('Student', 'lms-conversation')}</h5>
                                                <p>{__('Really? That\'s greet...', 'lms-conversation')}</p>
                                            </div>
                                            <div>
                                                <span>2:34pm</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <div className={style.userImg}></div>
                                            </div>
                                            <div>
                                                <h4>{__('Student Name', 'lms-conversation')}</h4>
                                                <h5>{__('Student', 'lms-conversation')}</h5>
                                                <p>{__('Really? That\'s greet...', 'lms-conversation')}</p>
                                            </div>
                                            <div>
                                                <span>2:34pm</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <div className={style.userImg}></div>
                                            </div>
                                            <div>
                                                <h4>{__('Student Name', 'lms-conversation')}</h4>
                                                <h5>{__('Student', 'lms-conversation')}</h5>
                                                <p>{__('Really? That\'s greet...', 'lms-conversation')}</p>
                                            </div>
                                            <div>
                                                <span>2:34pm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={style.topHeader}>
                                    <div className={style.profiInfo}>
                                        <div></div>
                                        <div>
                                            <h5>{__('Student Name', 'lms-conversation')}</h5>
                                            <p>{__('Active Now', 'lms-conversation')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={style.closeBtn}></span>
                                    </div>
                                </div>

                                <div className={style.chatForm}>
                                    <div>
                                        <div>
                                            <span className={style.imoji}></span>
                                            <span className={style.imgUpload}></span>
                                        </div>
                                        
                                        <div>
                                            <input type="text" name="text_msg" id="text_msg" />
                                        </div>
                                        <div>
                                            <span className={style.sendBtn}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}


if (document.getElementById("lms_conversition_chat_ui")) {
    render(<App/>, document.getElementById("lms_conversition_chat_ui"));
}

