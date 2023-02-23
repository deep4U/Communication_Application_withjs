import React from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Nav from "./Nav.js";
import './css/documents-list.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular";

export class ManageDocuments extends React.Component { //export class

    constructor(props) {
        super(props);
        this.state = props.state;
        this.state.deleteShow = false;
        this.state.uploadShow = false;
        this.state.editShow = false;
        this.state.docName = false;
    }

    // deleteDocs deletes the document with documentID
    deleteDoc() {
        let documentId = this.state.targetId
        console.log('=============document deletion=====', documentId)
        let documents = this.state.documents;
        // go through all the documents in uploads localStorage
        for (const [index, documentItem] of documents.entries()) {
            if (documentId == documentItem.id) {
                documents.splice(index, 1);
                break;
            }
        }
        localStorage.setItem('uploads', JSON.stringify(documents));
        window.location.reload();
    }

    // upload new document
    uploadDocument = () => {
        // get inputs from input text box and file input
        let label = document.getElementById('label').value;
        console.log(document.getElementById('file'), "==============")
        let file = document.getElementById('file');
        if (file && file.files && file.files[0]) {
            file = file.files[0].name;
        }
        else {
            alert('label and file are mandatory fields!');
            return false;
        }
        // validation of data
        if (!label || !file) {
            alert('label and file are mandatory fields!');
            return false;
        }
        // load loggedin and uploads storage
        let userId = this.state.loggedin.id;
        let documents = this.state.documents;
        documents.push({
            id: Number(new Date()),
            userId: userId,
            label: label,
            fileName: file
        });
        localStorage.setItem('uploads', JSON.stringify(documents));
        window.location.reload();
        return true;
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

    hideModal = (id) => {
        let button = document.getElementById("add-button");
        if (button)
            button.style.backgroundColor = "#66FFFF";
        if (id === 'delete') {
            this.setState({ deleteShow: false });
        }
        else if (id === 'upload') {
            this.setState({ uploadShow: false });
        }
        else if (id === 'edit') {
            this.setState({ editShow: false });
            this.setState({ docName: false });
        }
    }

    // showModal presents the modal as per modalId and changes okButton border and onclick as per the inputs
    showModal = (modalId, targetId, documentsOrUsers) => {
        console.log("insideshowmodal", modalId, targetId, documentsOrUsers)
        this.setState({ targetId })
        // delete User logic
        if (modalId === "delete" && !documentsOrUsers) {
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
            this.setState({ deleteShow: true });
            this.setState({ targetId: targetId })
            if (okButton) {
                okButton.style.borderColor = "blue";
                okButton.style.borderWidth = "3px";
                // onclick should remove document with targetId
                okButton.onClick = () => this.deleteDocs(this.state.targetId);
            }
        }
        // Edit document
        if (modalId === 'edit') {
            this.setState({ targetId: targetId })
            console.log('document is ', document, 'labelEdit', document.querySelector('#labelEdit'))
        }
        if (modalId) {
            // show modal
            console.log('show ', modalId)
            if (modalId === 'delete') {
                this.setState({ deleteShow: true })
            }
            else if (modalId === 'upload') {
                this.setState({ uploadShow: true })
            }
            else if (modalId === 'edit') {
                this.setState({ editShow: true })
            }
        }
        let button = document.getElementById("add-button");
        if (button != null)
            // when modal is visible then add-button should be white
            button.style.backgroundColor = "white";
    }

    handleLabelChange = (event) => {
        console.log(event, "is the new value of changed label")
        this.setState({ docName: event.target.value })
    }

    getDocuments = () => {
        // fill document table from uploads storage dynamically
        return <tbody>
            {
                this.state.documents.map((documentItem, index) => {

                    return <tr>
                        <td>{documentItem.label}</td>
                        <td>{documentItem.fileName}</td>
                        <td>
                            <button
                                className='transparent-button'
                                id={'edit' + String(documentItem.id)}
                                value={documentItem.id}
                                onClick={() => this.showModal("edit", documentItem.id, true)}>
                                Edit</button>
                            |
                            <button
                                onClick={() => this.showModal('delete', documentItem.id, true)}
                                className="transparent-button" value={documentItem.id} id={'delete' + String(documentItem.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                })
            }
            <tr>
                <td><button variant='info' className="add-button" onClick={() => this.showModal('upload', null)}>+ Add Upload</button></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    }

    handleEditSave =
        (event) => {
            console.log(this, "is this inside handleEditSave")
            // if no label is given give alert
            if (!this.state.docName) {
                alert('label is mandatory!');
                return false;
            }
            else {
                let documents = this.state.documents;
                let documentFound = {};
                // loop through documents in uploads localStorage
                for (let documentItem of documents) {
                    if (this.state.targetId == documentItem.id) {
                        documentFound = documentItem;
                        console.log(documentFound.id, "found")
                        documentFound.label = this.state.docName;
                        break;
                    }
                }
                localStorage.setItem('uploads', JSON.stringify(this.state.documents));
                this.hideModal("edit");
            }
        }

    setCurrent = (event) => {
        let currentBars = this.refs.chat;
        currentBars.style.backgroundColor = "white";
    }

    render() {
        return <div id='body'>
            {this.checkLogin()}
            <Nav current='documents-list'></Nav>
            <br></br><br></br>
            <b>My Uploads</b>
            <table className="docs-table" id="docs-table">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>File Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {this.getDocuments()}
            </table>
            <Modal
                show={this.state.editShow}
                onHide={() => this.hideModal('edit')}
                tabIndex='-1'
                contentClassName='middle-screen'
                dialogClassName="middle-screen"
                id='edit'>
                <Modal.Header
                    closeButton
                    className="heading-box container">
                    <Modal.Title
                        className="modal-title">
                        <b>Edit</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="description-div heading-div heading">
                    <table cellSpacing="30px" className='no-border'>
                        <tbody>
                            <tr>
                                <td>
                                    <b> Label</b>
                                </td>
                                <td><input className="input-field-modal" type="text" id="labelEdit" name="labelEdit"

                                    onChange={this.handleLabelChange}
                                    defaultValue="" /><br></br></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button id="save" className="button-margin-sides"
                                        onClick={(event) => this.handleEditSave()}>Save</button>
                                    <button className="button-margin-sides pad-sides" onClick={(event) => { this.hideModal('edit') }}
                                    >Cancel</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>

            <Modal
                show={this.state.deleteShow}
                onHide={() => this.hideModal('delete')}
                contentClassName='middle-screen modal-custom '
                dialogClassName="middle-screen modal-custom "
                tabIndex='-1'>
                <Modal.Header closeButton
                    className="heading-box container-div">
                    <Modal.Title>
                        <h5>Confirm File Deletion</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="description-div heading-div heading">
                    <FontAwesomeIcon icon={faQuestionCircle} size='xl' color='blue' />
                    <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Are you Sure?</b>
                    <br></br>
                    <br></br>
                    <br></br>
                    <input type='hidden' id='document-id'></input>
                    <Button variant="outline-secondary" className="button-white-small ok-button" id='okButtonDocs' ref='okButtonUsers'
                        onClick={() => this.deleteDoc()}>ok</Button>
                    <Button variant="outline-secondary" type="button" className="button-white-small" data-dismiss="modal" onClick={() => this.hideModal('delete')}
                    >Cancel</Button>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.uploadShow} onHide={() => this.hideModal('upload')} className='modal modal-custom' id='upload'>
                <Modal.Header closeButton className='heading-box'>
                    <Modal.Title >
                        <h className='modal-heading'><b>Upload</b></h>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='container-div'>
                    <table cellPadding={20} cellSpacing={10}>
                        <tbody>
                            <tr>
                                <td>
                                    <b> Label</b>
                                </td>
                                <td>
                                    <input type="text" name="label" id="label" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>File Upload</b>
                                </td>
                                <td>
                                    <input type="file" name="file" id="file" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button className="button" onClick={(event) => {
                                        if (this.uploadDocument()) {
                                            this.hideModal('upload')
                                        }
                                    }} >Upload&nbsp;Now</button><span></span>
                                </td>
                                <td>
                                    <button className="button" onClick={(event) => { this.hideModal('upload') }} >Cancel</button>
                                    <span></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </div>
    }
}

export default ManageDocuments;