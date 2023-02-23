import React from "react";
import './css/users-list.css';
import Nav from "./Nav";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular";

export class ManageUsers extends React.Component { //export class

    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.deleteShow = false
        // this.modalDeleteRef = React.createRef();
        console.log(this.state, "here is state from parent in manageusers")
    }

    hideModal(id) {
        let button = document.getElementById("add-button");
        if (button)
            button.style.backgroundColor = "#66FFFF";
        if (id === 'delete') {
            this.setState({ deleteShow: false })
        }
    }

    // deleteUser with given deleteId
    deleteUser(deleteId) {
        deleteId = this.state.targetId;
        console.log('inside deleteuser')
        // load users uploads and chat storage
        let users = this.state.users;
        let uploads = this.state.documents;
        let chatObjList = this.state.chatObj;
        // find indices to delete in docs and chat storage for that user
        let deleteIndexDocs = [];
        for (const [index, upload] of uploads.entries()) {
            if (upload.userId === deleteId) {
                deleteIndexDocs.push(index);
            }
        }
        let deleteIndexChat = []
        for (const [index, chatObj] of chatObjList.entries()) {
            if (chatObj.id === deleteId) {
                deleteIndexChat.push(index);
            }
        }
        // delete elements in docs and chat that belong to given user
        while (deleteIndexDocs.length) {
            uploads.splice(deleteIndexDocs.pop(), 1);
        }
        while (deleteIndexChat.length) {
            chatObjList.splice(deleteIndexChat.pop(), 1);
        }
        localStorage.setItem('chats', JSON.stringify(chatObjList));
        localStorage.setItem('uploads', JSON.stringify(uploads));
        // find user's index in localStorage of users and delete user from there
        for (const [index, user] of users.entries()) {
            if (user.id === deleteId) {
                let deletedUser = users.splice(index, 1);
                localStorage.setItem('users', JSON.stringify(users));
                // hide modal as operation is done
                this.hideModal('delete');
                // reload page to reflect the change
                window.location.reload();
                return true;
            }
        }
    }

    // showModal presents the modal as per modalId and changes okButton border and onclick as per the inputs
    showModal = (modalId, targetId, documentsOrUsers) => {
        console.log("insideshowmodal", modalId, targetId, documentsOrUsers)
        let modal = document.getElementById(modalId);
        // delete User logic
        if (modalId === "delete" && !documentsOrUsers) {
            // let okButton = document.getElementById('ok-button-users');
            // let okButton = this.modalDeleteRef.current;
            // let okButton = this.refs.okButtonUsers;
            this.setState({ deleteShow: true });
            this.setState({ targetId: targetId })
            let okButton = document.querySelector('#okButtonUsers');
            if (okButton) {
                okButton.style.borderColor = "blue";
                okButton.style.borderWidth = "3px";
                // onclick should remove user with targetId
            }
            console.log(okButton, "is ok button")
        }
        // delete document logic
        if (modalId === "delete" && documentsOrUsers) {
            let okButton = document.getElementById('ok-button-docs');
            if (okButton) {
                okButton.style.borderColor = "blue";
                okButton.style.borderWidth = "3px";
                // onclick should remove document with targetId
                okButton.onClick = () => this.deleteDocs(targetId);
            }
        }
        // Edit document
        if (modalId === 'edit') {
            let documents = this.state.documents;
            let documentFound = {};
            // loop through documents in uploads localStorage
            for (let documentItem of documents) {
                if (targetId === documentItem.id) {
                    documentFound = documentItem;
                    break;
                }
            }
            if (document.getElementById('labelEdit')) {
                // label should show current value of document by default
                document.getElementById('labelEdit').value = documentFound.label;
                // save button should update document label
                document.getElementById('save').onclick = () => {
                    documentFound.label = document.getElementById('labelEdit').value;
                    // if no label is given give alert
                    if (!document.getElementById('labelEdit').value) {
                        alert('label is mandatory!');
                        return false;
                    }
                    localStorage.setItem('uploads', JSON.stringify(documents));
                    this.hideModal("edit");
                    window.location.reload();
                }
            }
        }
        if (modal) {
            // show modal
            console.log('show ', modal)
            if (modal === 'delete') {
                this.setState({ deleteShow: true })
            }
        }
        let button = document.getElementById("add-button");
        if (button != null)
            // when modal is visible then add-button should be white
            button.style.backgroundColor = "white";
    }

    generateUsersTable = (event) => {
        // load users localstorage
        console.log(this.state, "is state while building users table")
        let tbodyUsers = <tbody id='user-table-body'>
            {
                this.state.users.map((user, index) => {
                    let editUrl = new URL(window.location.pathname.split('/').slice(0, -1).join('/') + "/edit-users", window.location.origin);
                    editUrl.searchParams.append('id', user.id);
                    let deleteButton = null
                    if (user.id === this.state.loggedin.id) {
                        deleteButton = null
                    }
                    else {
                        deleteButton = <button
                            className="transparent-button"
                            value={user.id}
                            onClick={() => this.showModal("delete", user.id, false)}
                        >Delete</button>
                    }
                    return (
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>

                            <td>
                                <a href={editUrl}>Edit</a>
                                {'|'}
                                {deleteButton}
                            </td>
                        </tr>

                    )
                }
                )
            }
        </tbody>
        return tbodyUsers
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
            <Nav current='users-list'></Nav>
            <div><h1><b>Users</b></h1></div>
            <table id="user-table" className="user-table" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>User Email ID</th>
                        <th></th>
                    </tr>
                </thead>
                {this.generateUsersTable()}
            </table>

            <Modal
                show={this.state.deleteShow}
                onHide={() => this.hideModal('delete')}
                contentClassName='middle-screen modal-custom '
                dialogClassName="middle-screen modal-custom "
                tabIndex='-1'>
                <Modal.Header
                    closeButton
                    className="heading-box container-div"
                >
                    <Modal.Title >
                        <h5>Confirm User Deletion</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="description-div heading-div heading">
                    <FontAwesomeIcon icon={faQuestionCircle} size='xl' color='blue' />
                    <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Are you Sure?</b>
                    <br></br>
                    <br></br>
                    <br></br>
                    <input type='hidden' id='user-id'></input>
                    <button type="button"
                        className="button-white-small" id='okButtonUsers' ref='okButtonUsers'
                        onClick={() => this.deleteUser()}>ok</button>
                    <button type="button" className="button-white-small" data-dismiss="modal" onClick={() => this.hideModal('delete')}>Cancel</button>
                </Modal.Body>
            </Modal>
        </div>
    }
}
