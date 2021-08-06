import { render, h, Component } from 'preact';
import FetchWP from './utils/fetchWP';
import chaticon from './icons/chat.svg';

//CSS 
import style from './frontend.scss';
import { sprintf, _n, __ } from '@wordpress/i18n';


import { auth, googleAuthProvider, database, Schema, storage } from "./component/config";



const IDontCareAboutFirebaseAuth = () => {
    return <div>This part won't react to firebase auth changes</div>;
};

const coursePublicDB = database.ref('/messages/public/' + lms_conversition_object.post_id);
const storageRef = storage.ref();
const imageRef = storageRef.child('images')




class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }, 
            chats: [], 
            chat_window_active: false
        }

        this.fetchWP = new FetchWP({
            restURL: window.lms_conversition_object.root,
            restNonce: window.lms_conversition_object.api_nonce,

        });

    }


    componentDidMount() {
        // this.fetchData();
        coursePublicDB
        .orderByChild('room')
        .equalTo('public')
        .on('value', snapshot => {
            this.setState({ chats: snapshot.val() });
        });


        // storage.ref('/images/').listAll().then( res => {
        //     let promises = []
        //     res.items.forEach( item => {
        //         item.getDownloadURL().then( (downloadURL) => {

                    

        //             var filename = downloadURL.split('/').pop()
        //             filename = filename.split('?').shift()
        //             promises[filename] = downloadURL
        //         })
        //     })
            
            

        //     this.setState({
        //         download: promises
        //     })
        // })

      

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


    /**
     * @Toggle chat window
     */
    toggleChatWindow = (e) => {
        e.preventDefault()
        console.log('button Clicked');
        const {chat_window_active} = this.state
        this.setState({
            chat_window_active: !chat_window_active ? true : false
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


    /**
     * 
     * @param {*} e default event
     * @perpose form submit
     */
    onFormSubmit = (e) => {
        e.preventDefault()
        Schema.createDate = Date.now()
        if(Schema.text_msg != ''){
            coursePublicDB.push(Schema)
        }
        Schema.text_msg = ''
    }

    /**
     * 
     * @param {Default event} e 
     * @Input change hander
     */
    changeHandler = (e) => {
        
        e.preventDefault()
        switch(e.target.name){
            case 'attachment': 
                const filename = Math.floor(Math.random() * 90000000000) + e.target.files[0].name
                const type = filename.split('.')[1]
                console.log('type: ', type)
                storage.ref(`/images/${filename}`).put(e.target.files[0]).then((snapshot) => {
                    snapshot.ref.getDownloadURL().then(downloadUrl => {
                        Schema[e.target.name] = downloadUrl
                        Schema.type = type
                        coursePublicDB.push(Schema)
                        Schema[e.target.name] = ''
                        Schema.type = ''
                    })
                })
            break;
            default:
                Schema[e.target.name] = e.target.value
        }
        
    }

    render() {
        let {config, chats, download} = this.state
        if(!chats) chats = []
        console.log('all chats: ', chats)
        

        
        const activeClass = this.state.chat_window_active ? 'active' : 'close';
        return (
                <div className={style.chatWrap}>
                    <div className={style.chatIcon} onClick={(e) => this.toggleChatWindow(e)}>
                        <img src={`${window.lms_conversition_object.assets_url}images/${chaticon}`} alt={__('LMS Chat', 'lms-conversation')} />
                    </div>
                    <div className={`${style.chatWindow} ${activeClass}`}>
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
                                                <input type="search" onChange={this.changeHandler} name="search" id="search" placeholder={__('Search', 'lms-conversation')} />
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
                                        <span onClick={(e) => this.toggleChatWindow(e)} className={style.closeBtn}></span>
                                    </div>
                                </div>


                                <div className={style.chatbodyLists}>
                                    {/* <button onClick={() => auth.signInWithRedirect(googleAuthProvider)}>
                                    Sign In
                                    </button> */}
                                    <div className={style.chatLists}>
                                        <ul>
                                            {     
                                                Object.keys(chats).map( (k, v) => {

                                                    return(
                                                        <li className={ chats[k].sender_id == window.lms_conversition_object.user_id ? style.thisuser : style.fromanother } key={v}>
                                                            {
                                                                chats[k].sender_id != window.lms_conversition_object.user_id && (
                                                                    <span className={style.userimg} style={{backgroundImage: "url("+chats[k].avatar_url+")"}} ></span>
                                                                )
                                                            }
                                                            {
                                                                (typeof chats[k].attachment != 'undefined' && chats[k].attachment != '') && (
                                                                    <a target="_blank" href={chats[k].attachment}>
                                                                        <img src={chats[k].attachment} alt="" />
                                                                    </a>
                                                                )
                                                            }
                                                            {
                                                                chats[k].text_msg != '' && (
                                                                    <span className={style.msg}>{chats[k].text_msg}</span>
                                                                )
                                                            }
                                                        </li>
                                                    )
                                                })        
                                            }
                                        </ul>
                                    </div>
                                </div>






                                <div className={style.chatForm}>
                                    <div>
                                        <form onSubmit={this.onFormSubmit}>
                                            <div>
                                                <span className={style.imoji}></span>
                                                <label for="attachment"><span className={style.imgUpload}></span></label>
                                                <input className={style.fileUPloadInput} type="file" onChange={this.changeHandler} name="attachment" id="attachment" />
                                            </div>
                                            
                                            <div>
                                                <input onChange={this.changeHandler} 
                                                    type="text" 
                                                    name="text_msg" 
                                                    value={Schema.text_msg}
                                                    id="text_msg" />
                                            </div>
                                            <div>
                                                <button type="submit">
                                                    <span className={style.sendBtn}></span>
                                                </button>
                                            </div>
                                        </form>
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

