import React from "react";
import Nav from "./Nav.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/fontawesome-free-solid";

export class GroupChat extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.state;
    }

    dateFormatter(dateObj) {
        // format date for chat storage
        return `[${dateObj.toISOString().slice(0, 10)} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}]`;
    }

    setGroupChat = () => {
        // add message to group chat
        let chatObjList = this.state.chatObjList;
        let message = document.getElementById('message').value;
        if (message === '' || !message) {
            alert("message is a mandatory feild!");
            return false;
        }
        let name = this.state.loggedin.name
        let dateObj = new Date();
        let date = this.dateFormatter(dateObj);
        let chatObj = {
            id: this.state.loggedin.id,
            name: this.state.loggedin.name,
            email: this.state.loggedin.email,
            text: `${date} ${name} : ${message}`
        };
        chatObjList.push(chatObj);
        localStorage.setItem('chats', JSON.stringify(chatObjList));
        window.location.reload();
    }

    getChatData = (event) => {
        // load chat data from local storage and display in chat-div
        let chatDiv = <div className="chat-div" id="chat-div">
            {
                this.state.chatObjList.map((chatObj, index) => {
                    return <p>{chatObj.text}</p>
                })
            }
        </div>
        return chatDiv;
    }

    // get user name printed in chat page
    getUserName() {
        // load loggedin storage and read name of user
        let name = this.state.loggedin.name;
        return name;
    }

    checkLogin = (event) => {
        // load loggedin storage data
        let loggedin = localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')) : window.location.href = './welcome';
        // check if user is logged in or not
        // if not redirect to welcome (loggedin storage does not exist or is empty)
        let count = 0;
        if (loggedin) {
            for (let key in loggedin) {
                count++;
                break;
            }
        }
        if (count === 0) {
            window.location.href('./welcome');
        }
    }

    render() {
        return <div id='body'>
            {this.checkLogin()}
            <Nav current='chat'></Nav><div className="container-div">Group Chat
                <span className="right-float">
                    <button className="transparent-button" onClick={() => window.location.href = '/login-success'}>
                        <img className="cancel-image" src="../cancel.PNG" alt=""></img>
                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                    </button>
                </span>
                {this.getChatData()}
            </div>
            <div className="options-div"> <b>
                {this.getUserName()}
            </b> <input className="input" type="text" name="message" id="message" defaultValue="I am good" />
                <button className="button-white" onClick={this.setGroupChat}>Send</button>
                <button className="button-white" onClick={(event) => { window.location.reload(false); }}>Refresh</button>
            </div>
        </div>
    }
}

export default GroupChat;