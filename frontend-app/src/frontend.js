import { render, h, Component } from 'preact';
import FetchWP from './utils/fetchWP';
import chaticon from './icons/chat.svg';
import attachment from './icons/attachment.svg';

//CSS 
import style from './frontend.scss';
import { sprintf, _n, __ } from '@wordpress/i18n';


import { auth, googleAuthProvider, database, Schema, storage } from "./component/config";



const IDontCareAboutFirebaseAuth = () => {
    return <div>This part won't react to firebase auth changes</div>;
};

const coursePublicDB = database.ref('/messages/' + lms_conversition_object.post_id);

const storageRef = storage.ref();
const imageRef = storageRef.child('images')

const imgsType = ['png', 'svg', 'jpg', 'jpeg'];


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
            chat_window_active: false, 
            users: [], 
            room: 'public', 
            schema: Schema
        }

        this.fetchWP = new FetchWP({
            restURL: window.lms_conversition_object.root,
            restNonce: window.lms_conversition_object.api_nonce,

        });

        this.changeHandler = this.changeHandler.bind(this)

    }


    componentDidMount() {
        // this.fetchData();
        coursePublicDB
        .child('msg')
        .orderByChild('room')
        .equalTo('public')
        .on('value', snapshot => {
            this.setState({ chats: snapshot.val() });
        });

        // Users 
        let {users} = this.state
        coursePublicDB
        .child('users')
        .on('value', snapshot => {
            if(snapshot.val()){
                users = snapshot.val();
                Object.keys(snapshot.val()).map( (k, v) => {
                    coursePublicDB
                    .child('msg')
                    .limitToLast(1).once('value', lstmsg => {
                        let key = Object.keys(lstmsg.val());
                        users[k]['text_msg'] = lstmsg.val()[key].text_msg
                        users[k]['createDate'] = lstmsg.val()[key].createDate
                    })
                })

                this.setState({
                    users: users
                })
            }
        });
        

        

      console.log('this is upate omar')
      

    }

    componentWillUnmount() {
        console.log('state room: ', this.state.room)
    }


    componentDidUpdate(){
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
        let {room, schema} = this.state
        schema.createDate = Date.now()
        schema.room = room

        console.log('Schema: ', schema)
        if(schema.text_msg != ''){
            coursePublicDB.child('msg').push(schema)
        }
        schema.text_msg = ''
        this.setState({schema: schema})
    }

    /**
     * 
     * @param {Default event} e 
     * @Input change hander
     */
    changeHandler = (e) => {
        let {schema, room} = this.state
        e.preventDefault()
        switch(e.target.name){
            case 'attachment': 
                const filename = Math.floor(Math.random() * 90000000000) + e.target.files[0].name
                const type = filename.split('.')[1]
                storage.ref(`/images/public/${filename}`).put(e.target.files[0]).then((snapshot) => {
                    snapshot.ref.getDownloadURL().then(downloadUrl => {
                        schema[e.target.name] = downloadUrl, 
                        schema.name = filename
                        schema.type = type
                        schema.room = room
                        coursePublicDB.child('msg').push(schema)
                        schema[e.target.name] = ''
                        schema.type = ''
                    })
                })
            break;
            default:
                schema[e.target.name] = e.target.value
        }
        this.setState({schema: schema})
    }


    roomHandler = (e, user_id) => {
        let room = 'public'
        if(user_id != 'public'){
            let current_user_id = window.lms_conversition_object.user_id
            room = [user_id, current_user_id]
            room = room.sort((a, b) => a - b)
            room = room.join('')
        }
        
        
        coursePublicDB
        .child('msg')
        .orderByChild('room')
        .equalTo(room)
        .on('value', snapshot => {
            this.setState({ 
                chats: snapshot.val(), 
                room: room
            });
        });

        
    }

    render() {
        let {config, chats, download, users, schema} = this.state
        if(!chats) chats = []
        console.log('all chats: ', chats)
        // console.log('all usrs: ', users)
        

        
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

                                        <div onClick={(e) => this.roomHandler(e, 'public')}>
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

                                        {/* Users */}
                                        {
                                             
                                                Object.keys(users).map( (k, v) => {
                                                    if(users[k].user_id != window.lms_conversition_object.user_id){
                                                        return(
                                                            <div onClick={(e) => this.roomHandler(e, users[k].user_id)} key={v}>
                                                                <div>
                                                                    <div className={style.userImg}></div>
                                                                </div>
                                                                <div>
                                                                    <h4>{users[k].name}</h4>
                                                                    <h5>{users[k].user_type}</h5>
                                                                    <p>{typeof users[k].text_msg != 'undefined' ? users[k].text_msg : ''}</p>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        {/* <Moment date={users[k].createDate} /> */}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                        }

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
                                                    console.log('this k: ', k)
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
                                                                        {
                                                                            (() => {
                                                                                if(imgsType.includes( chats[k].type )){
                                                                                    return(
                                                                                        <img src={chats[k].attachment} alt="Images" />
                                                                                    )
                                                                                }else{
                                                                                    
                                                                                    return(
                                                                                        <span className={`${style.attachmentWrap} ${style.msg}`}>
                                                                                            <img className={style.otherAttachment} src={`${window.lms_conversition_object.assets_url}images/${attachment}`} Alt={__('Attachment', 'lms-conversation')}/>
                                                                                            <span>
                                                                                                {
                                                                                                    typeof chats[k].name != 'undefined' ? chats[k].name : __('Download Attachment', 'lms-conversation')
                                                                                                }
                                                                                            </span>
                                                                                        </span>
                                                                                    )
                                                                                }
                                                                            })()
                                                                        }
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
                                                    value={schema.text_msg}
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

