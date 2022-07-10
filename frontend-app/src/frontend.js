import { render, h, Component } from 'preact';
import FetchWP from './utils/fetchWP';
import attachment from './icons/attachment.svg';

//CSS 
import style from './frontend.scss';
import {sprintf, _n, __ } from '@wordpress/i18n';
import group_img from './icons/user-group-img.svg';

import firebase, { auth, database, storage } from "./component/config";




const coursePublicDB = database.ref('/messages/' + lms_conversition_object.post_id);


const storageRef = storage.ref();
const imageRef = storageRef.child('images')

const imgsType = ['png', 'svg', 'jpg', 'jpeg'];




class FrontEnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            saving: false,
            collospe: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }, 
            duesee: {},
            chats: [], 
            chat_window_active: false, 
            users: [], 
            room: 'public', 
            schema: {
                sender_id: window.lms_conversition_object.user_id,
                avatar_url: window.lms_conversition_object.avatar_url,
                text_msg: '', 
                room: 'public', 
                send_to: 'public',
                createDate: Date.now()
            }, 
            room_name: window.lms_conversition_object.post_title, 
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
        this.toggleCollepseLeftWindow = this.toggleCollepseLeftWindow.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.roomHandler = this.roomHandler.bind(this)
        this.toggleChatWindow = this.toggleChatWindow.bind(this)
    }


    /**
     * @param null 
     * @desc initial callback function
     */
    componentDidMount() {
        this.fetchData()
        this.userPresentStatus()
        this.alertHandler()
    }


    

    /**
     * 
     * @param {default event} e 
     * left toggle button
     */
    toggleCollepseLeftWindow = (e) => {
        let {collospe} = this.state
        this.setState({
            collospe: !collospe ? true : false
        })
    }


    /**
     * @param null  
     * @description sound alert
     */
    alertHandler = () =>{
        let {duesee, room} = this.state
        coursePublicDB
        .on('child_changed', function(snapshot) {
            if(snapshot.key === 'msg'){
                let roomcount = {}

                Object.keys(snapshot.val()).map((k, v) => {
                    if(typeof roomcount[snapshot.val()[k].room] == 'undefined') roomcount[snapshot.val()[k].room] = 0 
                    roomcount[snapshot.val()[k].room] = roomcount[snapshot.val()[k].room] +=1;
                })

                Object.keys(roomcount).map((k, v) => {
                    let localvalue = localStorage.getItem(`lmsc_${k}`) !== null ? parseInt(localStorage.getItem(`lmsc_${k}`) ) : 0 
                    duesee[k] =  roomcount[k] - localvalue
                })

                
                let lastitem = Object.keys(snapshot.val()).length - 1
                lastitem = Object.keys(snapshot.val())[lastitem]
                lastitem = snapshot.val()[lastitem]
                if(typeof window.lms_conversition_object.settings.notifucation_sound != 'undefined' && window.lms_conversition_object.settings.notifucation_sound != '' && lastitem.send_to === window.lms_conversition_object.user_id){
                    let audio = new Audio(window.lms_conversition_object.assets_url + 'sounds/' + window.lms_conversition_object.settings.notifucation_sound)
                    audio.play()
                }
            }
            
        })

        this.setState({
            duesee: duesee
        })
    }




    /**
     * @param null 
     * @description user present status offline / online
     */
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
            console.log('inside retun false')
            return;
        };  

        if(!auth.currentUser){
            location.reload();
        }
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
                console.log('set offline')
                // The promise returned from .onDisconnect().set() will
                // resolve as soon as the server acknowledges the onDisconnect() 
                // request, NOT once we've actually disconnected:
                // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

                // We can now safely set ourselves as 'online' knowing that the
                // server will mark us as offline once we lose connection.
                userStatusDatabaseRef.set(isOnlineForDatabase).then(function(){
                    console.log('set online')
                });
            });
        });
    }


    componentWillUnmount() {}


    componentDidUpdate(){}



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


    /**
     * @desc initially featch data
     */
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
            this.setState({ 
                chats: snapshot.val(), 
                loader: false 
            });
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
                            let text_msg = lstmsg.val()[key].text_msg
                            text_msg = text_msg.length > 15 ? `${text_msg.substring(0, 15)}...` : text_msg
                            users[k]['text_msg'] = text_msg
                            users[k]['createDate'] = lstmsg.val()[key].createDate    

                        }

                        this.setState({
                            users: users
                        })
                    })
                }) 
            }
        });


        //Last public message
        coursePublicDB
        .child('msg')
        .orderByChild('room')
        .equalTo('public')
        .limitToLast(1).once('value', lstmsg => {
            if(lstmsg.val()){
                let val = Object.values(lstmsg.val())
                if(val[0].text_msg){
                    let ptext_msg = val[0].text_msg
                    ptext_msg = ptext_msg.length > 15 ? `${ptext_msg.substring(0, 15)}...` : ptext_msg
                    this.setState({
                        public_last_msg: ptext_msg
                    })
                } 
            }
        })
    }


    /**
     * 
     * @param {*} e default event
     * @perpose form submit
     */
    onFormSubmit = (e) => {
        e.preventDefault()
        let submit = true
        
        let {room, schema, send_to} = this.state
        schema.createDate = Date.now()
        schema.room = room

        if(schema.text_msg == ''){
            schema.text_msg = document.getElementById('text_msg').value
        }

        

        if(typeof send_to != 'undefined')
            schema.send_to = send_to

        if(schema.text_msg != ''){
            coursePublicDB.child('msg').push(schema, () => {
            })
        }

        if(submit == true){
            schema.text_msg = ''
            this.setState({schema: schema})
            submit = false
        }
        
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

    /**
     * 
     * @param {default event} e 
     * @param {user id} user_id 
     * @desc  Change room
     */
    roomHandler = (e, user_id, room) => {
        e.preventDefault()
        

        let {users, duesee, collospe} = this.state

        let click = true
        let width = window.innerWidth
        if(width < 412)
            collospe = true
        

        coursePublicDB
        .child('msg')
        .on('value', snapshot => {
            let tempRoom = click == true ? room : this.state.room

            let filter = {}
            if(snapshot.val()){
                Object.keys(snapshot.val()).map( (k, v) => {
                    if(snapshot.val()[k].room == tempRoom){
                        filter[k] = snapshot.val()[k]
                    }
                })

                localStorage.setItem(`lmsc_${room}`, filter.length)
                duesee[room] = 0;
            }
            click = false

            this.setState({ 
                chats: filter, 
                duesee: duesee,
                collospe: collospe,
                send_to: room != 'public' ? users[user_id].user_id : user_id,
                room_name: typeof users[user_id] != 'undefined' && room != 'public' ? users[user_id].name : window.lms_conversition_object.post_title, 
                room_status: (typeof users[user_id] != 'undefined' && users[user_id].status == 'online' && room != 'public') || room == 'public' ? __('Active Now', 'lms-conversation') : __('Inactive Now', 'lms-conversation'),
                user_img: typeof users[user_id] != 'undefined' && users[user_id].user_img != '' && room != 'public' ? users[user_id].user_img : window.lms_conversition_object.assets_url + 'images/' + group_img
            });
        });

        
        this.setState({room: room})
        
    }


    searchUserHandler = (e) => {
        let svalue = e.target.value

        
        // Users 
        this.setState({users: []})
        let {users} = this.state

        if(svalue == ''){
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
                            
                            this.setState({
                                users: users
                            })
                        })
                    })
                    
                }
            });
        }else{
            
            coursePublicDB
            .child('users')
            .orderByChild('name')

            .startAt(svalue)
            .endAt(svalue+"\uf8ff")
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

        this.setState({svalue: svalue})
    }


    /**
     * 
     * @param {default event} e 
     * @desc If sender press Enter kay then submit message
     */
    keyPressEvent = (e) => {
        let {schema} = this.state
        if(e.key == 'Enter'){
            e.preventDefault()
            this.onFormSubmit(e)
        }else{
            schema.text_msg = e.target.value
            this.setState({
                schema:schema
            })
        }
        
    }

    deleteThis = (key) => {
        coursePublicDB
        .child('msg')
        .child(key).set({})
    }


    render() {
        let {config, chats, loader, public_last_msg, download, users, schema, room_name, room_status, user_img, duesee, collospe, room, svalue} = this.state
        if(!chats) chats = []
        let dates = []

        const activeClass = this.state.chat_window_active ? 'active' : 'close';
        let findThisUser = Object.keys(users).find( (v) => {
            return users[v].user_id == window.lms_conversition_object.user_id
        })

        if(loader){
            return(
                <div className={style.loader}>
                    <img src={`${window.lms_conversition_object.assets_url}images/loading.svg)`} alt={__('Lms Loader', 'lms-conversation')} />
                </div>
            )
        }

        /**
         * Check user limit for free version 
         * Free version are allow 10 user for chat
         */
        if(Object.keys(users).length >= window.lms_conversition_object.user_limit  && typeof findThisUser == 'undefined') return;

        return (
                <div className={style.chatWrap}>
                    
                    <div className={style.chatIcon}>
                        <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/chat.svg)`}} onClick={(e) => this.toggleChatWindow(e)}></span>
                    </div>
                    <div className={`${style.chatWindow} ${activeClass}`}>
                        <div className={`${style.chatBody} ${collospe ? style.collospe : ''}`}>
                            <div className={style.profileInfoWrap}>
                                
                                {/* Profile Information */}
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


                                {
                                    (window.lms_conversition_object.user_type == 'teacher' && Object.keys(users).length >= window.lms_conversition_object.user_limit) && (
                                        <div className={style.limitInformation}>
                                            {/* User Limitation Information to teacher and site admin */}
                                            <div>
                                                <span>{__('User limit is over for this course, please use', 'lms-conversation')}<a target={`_blank`} href="https://wppluginia.com/product/learning-management-system-lms-chat-application-pro/">{__(' pro version ', 'lms-conversation')}</a>{__('for unlimited user.', 'lms-conversation')}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                
                               
                            </div>
                            <div className={style.listWrap}>
                                <div>
                                    <div className={style.listHeader}>
                                        <h2>{__('Messages', 'lms-conversation')}</h2>
                                        <div className={style.searchbar}>
                                            <div>
                                                <input 
                                                    style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/search-interface-symbol.svg)`}}
                                                    type="search" 
                                                    onKeyPress={(e) => this.searchUserHandler(e)} 
                                                    onChange={(e) => {e.preventDefault()}} 
                                                    value={typeof svalue != 'undefined' ? svalue : ''} 
                                                    name="search" 
                                                    id="search" 
                                                    placeholder={__('Search', 'lms-conversation')} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.userList}>

                                        <div className={`${'public' === room ? `${style.active} ${style.singlelist}` : `${style.singlelist}`}`} >
                                            <div>
                                                <div style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/user-group-img.svg)`}} className={style.userImg}></div>
                                            </div>
                                            <div>
                                                <h4>{window.lms_conversition_object.post_title}</h4>
                                                <h5>{__('All Participants', 'lms-conversation')}</h5>
                                                {typeof public_last_msg != 'undefined' &&  (<p>{public_last_msg}</p>) }
                                            </div>
                                            <div className={style.clickable} onClick={(e) => this.roomHandler(e, '', 'public', '', 'online') }>
                                                <span></span>
                                            </div>
                                        </div>

                                        {/* Users */}
                                        {
                                                Object.keys(users).map( (k, v) => {
                                                    
                                                    let current_user_id = window.lms_conversition_object.user_id
                                                    let room_inst = [users[k].user_id, current_user_id]
                                                    room_inst = room_inst.sort((a, b) => a - b)
                                                    room_inst = room_inst.join('')



                                                    // let dateis = new Date(users[k].last_changed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                    if(users[k].user_id != window.lms_conversition_object.user_id){
                                                        return(
                                                            <div className={`${room_inst === room ? `${style.active} ${style.singlelist}` : `${style.singlelist}`}`} key={v}>
                                                                <div>
                                                                    <div 
                                                                    style={{backgroundImage: `url(${users[k].user_img})`}}
                                                                    className={style.userImg}>
                                                                        <span className={`${style.userPresentStatus} ${ style[users[k].status]}`}></span>
                                                                        {
                                                                            (typeof duesee[room_inst] != 'undefined' && duesee[room_inst] > 0) && (
                                                                                <span className={style.readNotification}>{duesee[room_inst]}</span>
                                                                            )
                                                                        }
                                                                        
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4>{users[k].name}</h4>
                                                                    <h5>{users[k].user_type}</h5>
                                                                    <p>{typeof users[k].text_msg != 'undefined' ? users[k].text_msg : ''}</p>
                                                                </div>
                                                                <div className={`${style.clickable} room_${room_inst}`} onClick={(e) => this.roomHandler(e, k, room_inst) }>
                                                                    {/* <span>
                                                                        {dateis}
                                                                    </span> */}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className={style.bodyWrap}>
                                <div className={style.topHeader}>
                                    <div className={style.clospe}>
                                        <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/left-arrow.svg)`}} onClick={(e) => this.toggleCollepseLeftWindow(e)} className={style.collspeBtn}></span>
                                    </div>
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
                                        <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/cancel.svg)`}} onClick={(e) => this.toggleChatWindow(e)} className={style.closeBtn}></span>
                                    </div>
                                </div>


                                <div className={style.chatbodyLists}>
                                    <div className={style.chatLists}>
                                        <ul>
                                            {     
                                                Object.keys(chats).map( (k, v) => {
                                                    let date = new Date(chats[k].createDate)
                                                    let today = new Date()
                                                    let difTime = Math.abs(today - date);
                                                    let difDays = Math.ceil(difTime / (1000 * 60 * 60 * 24)); 

                                                    let msgDate = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

                                                    today = today.toISOString().split('T')[0]
                                                    date = date.toISOString().split('T')[0]
                                                    if(date == today) date = __('Today', 'lms-conversation')
                                                    if(difDays == 2) date = __('Yesterday', 'lms-conversation')
                                                    
                                                    return(
                                                        <li className={ chats[k].sender_id == window.lms_conversition_object.user_id ? style.thisuser : style.fromanother } key={v}>
                                                            {/* Dates */}
                                                            {
                                                                (() => {
                                                                    if(dates.includes(date) === false){
                                                                        dates.push(date)
                                                                        return(
                                                                            <span className={style.date}>
                                                                                <span>{date}</span>
                                                                            </span>
                                                                        )
                                                                    }
                                                                })()
                                                            }
                                                            <span className={style.msgBody}>
                                                            {/* Avater */}
                                                            {
                                                                chats[k].sender_id != window.lms_conversition_object.user_id && (
                                                                    <span className={style.userimg} style={{backgroundImage: "url("+chats[k].avatar_url+")"}} ></span>
                                                                )
                                                            }

                                                            {/* Message Delete Option */}
                                                            {
                                                                (typeof window.lms_conversition_object.settings.remove_access != 'undefined' && window.lms_conversition_object.settings.remove_access === true && chats[k].sender_id == window.lms_conversition_object.user_id) && (
                                                                    <span className={style.deleteOption}>
                                                                        <span style={{backgroundImage: `url(${lms_conversition_object.assets_url}images/delete.svg)`}} onClick={(e) => this.deleteThis(k)} className={style.deleteThis}></span>
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
                                                                                            <img className={style.otherAttachment} src={`${window.lms_conversition_object.assets_url}images/${attachment}`} alt={__('Attachment', 'lms-conversation')}/>
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
                                                                    <span className={style.msg}>
                                                                        <span>{chats[k].text_msg}</span>
                                                                        <span className={style.msgDate}>{msgDate}</span>
                                                                    </span>

                                                                    
                                                                )
                                                            }
                                                                
                                                            </span>
                                                        </li>
                                                    )
                                                })        
                                            }
                                        </ul>
                                    </div>
                                </div>

                                <div className={style.chatForm}>
                                    <div>
                                    
                                        <form>
                                            <div>
                                                {/* <span className={style.imoji}></span> */}
                                                <label htmlFor="attachment"><span style={{backgroundImage: `url(${lms_conversition_object.assets_url}images/insert-picture-icon.svg)`}} className={style.imgUpload}></span></label>
                                                <input className={style.fileUPloadInput} type="file" onChange={this.changeHandler} name="attachment" id="attachment" />
                                            </div>
                                            
                                            <div>
                                                <input onChange={this.changeHandler} 
                                                    type="text" 
                                                    name="text_msg" 
                                                    onKeyUp={this.keyPressEvent}
                                                    value={schema.text_msg}
                                                    id="text_msg" />
                                            </div>
                                            <div>
                                                <button onClick={(e) => this.onFormSubmit(e)} id="submitBtn" ref={button => this.buttonElement = button} type="submit">
                                                    <span style={{backgroundImage: `url(${window.lms_conversition_object.assets_url}images/send-button.svg)`}} className={style.sendBtn}></span>
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
    render(<FrontEnd/>, document.getElementById("lms_conversition_chat_ui"));
}