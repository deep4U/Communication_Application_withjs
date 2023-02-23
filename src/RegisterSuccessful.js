import React from "react";

export class RegisterSuccessful extends React.Component { //export class
    render() {
        return <div id='body'>
            <h1 className="heading"><b>Registration Successful</b></h1>
            <p className="center-text">Thank you for registeration</p>
            <p className="center-text"><a className="heading" href="./welcome">Click to return to home page</a></p>
        </div>
    }
}