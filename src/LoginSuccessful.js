import React from "react";
import Nav from "./Nav.js";
export class LoginSuccessful extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.state;
        this.myRef = React.createRef();
    }

    // get current user's email id for welcome page
    getCurrentUser() {
        // load loggedin storage and read email of user
        let userEmail = this.state.loggedin.email;
        return userEmail;
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
        return <div id='body' ref={this.myRef}>
            {this.checkLogin()}
            <Nav></Nav>
            <h1 className="heading"><b>Login Successful</b></h1><br></br>
            <p className="center-text"><b>Welcome !</b>{this.getCurrentUser()}
            </p>
        </div>
    }
}

export default LoginSuccessful;