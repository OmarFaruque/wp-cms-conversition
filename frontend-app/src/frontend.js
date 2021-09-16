import { render, h, Component } from 'preact';
import FetchWP from './utils/fetchWP';
import chaticon from './icons/chat.svg';
import attachment from './icons/attachment.svg';

//CSS 
import style from './frontend.scss';
import { sprintf, _n, __ } from '@wordpress/i18n';
import group_img from './icons/user-group-img.svg';

import firebase, { auth, googleAuthProvider, database, Schema, storage } from "./component/config";




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
            schema: Schema, 
            room_name: __('Group Chat', 'lms-conversation'), 
            room_status: __('Active Now', 'lms-conversation'), 
            user_img: window.lms_conversition_object.assets_url + 'images/' + group_img
        }

        this.fetchWP = new FetchWP({
            restURL: window.lms_conversition_object.root,
            restNonce: window.lms_conversition_object.api_nonce,

        });

        this.changeHandler = this.changeHandler.bind(this)
        this.searchUserHandler = this.searchUserHandler.bind(this)
        this.deleteThis = this.deleteThis.bind(this)

    }


    componentDidMount() {
        this.fetchData()
        this.userPresentStatus()
    }

    userPresentStatus = () => {
        
        const isOfflineForDatabase = {
            name: window.lms_conversition_object.display_name, 
            user_type: window.lms_conversition_object.user_type, 
            user_id: window.lms_conversition_object.user_id,
            user_img: window.lms_conversition_object.avatar_url,
            last_changed: firebase.database.ServerValue.TIMESTAMP,
            status: 'offline'
        };

        const isOnlineForDatabase = {
            name: window.lms_conversition_object.display_name, 
            user_type: window.lms_conversition_object.user_type, 
            user_id: window.lms_conversition_object.user_id,
            user_img: window.lms_conversition_object.avatar_url,
            last_changed: firebase.database.ServerValue.TIMESTAMP,
            status: 'online'
        };

        database.ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() == false) {
            return;
        };  

        let uid = auth.currentUser.uid;
        let userStatusDatabaseRef = database.ref('/messages/' + lms_conversition_object.post_id +'/users/' + uid)
        // var uid = firebase.auth().currentUser.uid;
        // console.log('auth id: ', uid)
        // If we are currently connected, then use the 'onDisconnect()' 
        // method to add a set which will only trigger once this 
        // client has disconnected by closing the app, 
        // losing internet, or any other means.
        userStatusDatabaseRef.onDisconnect()
            .set(isOfflineForDatabase).then(function() {
                // The promise returned from .onDisconnect().set() will
                // resolve as soon as the server acknowledges the onDisconnect() 
                // request, NOT once we've actually disconnected:
                // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

                // We can now safely set ourselves as 'online' knowing that the
                // server will mark us as offline once we lose connection.
                userStatusDatabaseRef.set(isOnlineForDatabase);
            });
        });
    }



    componentWillUnmount() {
        // console.log('state room: ', this.state.room)
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
        const {chat_window_active} = this.state
        this.setState({
            chat_window_active: !chat_window_active ? true : false
        })
    }

    fetchData() {
        this.setState({
            loader: true,
        });
        let current_user_id = window.lms_conversition_object.user_id


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
                    
                    let room = [users[k]['user_id'], current_user_id]
                    room = room.sort((a, b) => a - b)
                    room = room.join('')

                    coursePublicDB
                    .child('msg')
                    .orderByChild('room')
                    .equalTo(room)
                    .limitToLast(1).once('value', lstmsg => {
                        
                        if(lstmsg.val()){
                            let key = Object.keys(lstmsg.val());
                            users[k]['text_msg'] = lstmsg.val()[key].text_msg
                            users[k]['createDate'] = lstmsg.val()[key].createDate      
                        }
                    })
                })

                this.setState({
                    users: users
                })
                
            }
        });
        


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
        let {users} = this.state

        
        let room = 'public'
        if(user_id != 'public'){
            let current_user_id = window.lms_conversition_object.user_id
            room = [users[user_id].user_id, current_user_id]
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
                room: room, 
                room_name: typeof users[user_id] != 'undefined' && room != 'public' ? users[user_id].name : __('Group Chat', 'lms-conversation'), 
                room_status: (typeof users[user_id] != 'undefined' && users[user_id].status == 'online' && room != 'public') || room == 'public' ? __('Active Now', 'lms-conversation') : __('Inactive Now', 'lms-conversation'),
                user_img: typeof users[user_id] != 'undefined' && users[user_id].user_img != '' && room != 'public' ? users[user_id].user_img : window.lms_conversition_object.assets_url + 'images/' + group_img
            });
        });

        
    }


    searchUserHandler = (e) => {
        let svalue = e.target.value
        
        
        // Users 
        this.setState({users: []})
        let {users} = this.state
        coursePublicDB
        .child('users')
        .orderByChild('name')
        .startAt(svalue)
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
    }



    deleteThis = (key) => {
        coursePublicDB
        .child('msg')
        .child(key).set({})
    }

    render() {
        let {config, chats, download, users, schema, room_name, room_status, user_img} = this.state
        if(!chats) chats = []
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
                                    <div className={style.profileImg}
                                        style={{
                                            backgroundImage: `url(${window.lms_conversition_object.avatar_url})`
                                        }}
                                    >

                                    </div>
                                    <h4>{window.lms_conversition_object.display_name}</h4>
                                    <p>{window.lms_conversition_object.user_type}</p>
                                </div>
                               
                            </div>
                            <div>
                                <div>
                                    <div className={style.listHeader}>
                                        <h2>{__('Messages', 'lms-conversation')}</h2>
                                        <div className={style.searchbar}>
                                            <div>
                                                <input type="search" onKeyPress={this.searchUserHandler} name="search" id="search" placeholder={__('Search', 'lms-conversation')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.userList}>

                                        <div onClick={(e) => this.roomHandler(e, 'public', '', 'online')}>
                                            <div>
                                                <div className={style.userImg}>
                                                </div>
                                            </div>
                                            <div>
                                                <h4>{__('Group Chat', 'lms-conversation')}</h4>
                                                <h5>{__('All Participants', 'lms-conversation')}</h5>
                                            </div>
                                            <div>
                                                <span></span>
                                            </div>
                                        </div>

                                        {/* Users */}
                                        {
                                             
                                                Object.keys(users).map( (k, v) => {
                                                    let dateis = new Date(users[k].last_changed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                    if(users[k].user_id != window.lms_conversition_object.user_id){
                                                        return(
                                                            <div onClick={(e) => this.roomHandler(e, k)} key={v}>
                                                                <div>
                                                                    <div 
                                                                    style={{backgroundImage: `url(${users[k].user_img})`}}
                                                                    className={style.userImg}>
                                                                        <span className={`${style.userPresentStatus} ${ style[users[k].status]}`}></span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4>{users[k].name}</h4>
                                                                    <h5>{users[k].user_type}</h5>
                                                                    <p>{typeof users[k].text_msg != 'undefined' ? users[k].text_msg : ''}</p>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        {dateis}
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
                                        <div style={{
                                            backgroundImage: `url(${user_img})`
                                        }}>

                                        </div>
                                        <div>
                                            <h5>{room_name}</h5>
                                            <p>{room_status}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span onClick={(e) => this.toggleChatWindow(e)} className={style.closeBtn}></span>
                                    </div>
                                </div>


                                <div className={style.chatbodyLists}>
                                    <div className={style.chatLists}>
                                        <ul>
                                            {     
                                                Object.keys(chats).map( (k, v) => {
                                                    return(
                                                        <li className={ chats[k].sender_id == window.lms_conversition_object.user_id ? style.thisuser : style.fromanother } key={v}>
                                                            
                                                            {/* Avater */}
                                                            {
                                                                chats[k].sender_id != window.lms_conversition_object.user_id && (
                                                                    <span className={style.userimg} style={{backgroundImage: "url("+chats[k].avatar_url+")"}} ></span>
                                                                )
                                                            }

                                                            {/* Message Delete Option */}
                                                            {
                                                                chats[k].sender_id == window.lms_conversition_object.user_id && (
                                                                    <span className={style.deleteOption}>
                                                                        <span onClick={(e) => this.deleteThis(k)} className={style.deleteThis}></span>
                                                                    </span>
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
                                                {/* <span className={style.imoji}></span> */}
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

