import React from 'react';
import Welcome from './Welcome'
import './css/styles.css'
import Login from './Login'
import Register from './Register'
import { LoginSuccessful } from './LoginSuccessful';
import GroupChat from './GroupChat.js';
import { RegisterSuccessful } from './RegisterSuccessful';
import { ManageUsers } from './ManageUsers';
import EditUsers from './EditUsers';
import ManageDocuments from './ManageDocuments';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './NotFound'
import LogOut from './logout';
export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [],
      documents: localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [],
      loggedin: localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')) : {},
      chatObjList: localStorage.getItem('chats') ? JSON.parse(localStorage.getItem('chats')) : [],
    }
  }

  componentDidMount(event) {
    this.setState({
      users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [],
      documents: localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : [],
      loggedin: localStorage.getItem('loggedin') ? JSON.parse(localStorage.getItem('loggedin')) : {},
      chatObjList: localStorage.getItem('chats') ? JSON.parse(localStorage.getItem('chats')) : []
    })
    console.log(this.state, "is the state of my main inside didmount")
  }
  shouldComponentUpdate() {
    return true;
  }

  render() {
    console.log(<div>
      <div>Main comp</div>
      <Welcome />
      <Login></Login>
    </div>)
    return <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome state={this.state}></Welcome>}></Route>
        <Route path='/welcome' element={<Welcome state={this.state}></Welcome>}></Route>
        <Route path='/login' element={<Login state={this.state}></Login>}></Route>
        <Route path='/Register' element={<Register state={this.state}></Register>}></Route>
        <Route path='/login-success' element={<LoginSuccessful state={this.state}></LoginSuccessful>}></Route>
        <Route path='/chat' element={<GroupChat state={this.state}></GroupChat>}></Route>
        <Route path='/register-success' element={<RegisterSuccessful state={this.state}></RegisterSuccessful>}></Route>
        <Route path='/users-list' element={<ManageUsers state={this.state}></ManageUsers>}></Route>
        <Route path='/edit-users' element={<EditUsers state={this.state}></EditUsers>}></Route>
        <Route path='/documents-list' element={<ManageDocuments state={this.state}></ManageDocuments>}></Route>
        <Route path='/logout' element={<LogOut ></LogOut>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </BrowserRouter>
  }
}