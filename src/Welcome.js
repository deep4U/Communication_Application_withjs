import React from "react";
import './css/welcome.css';
export class Welcome extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.state)
    }

    render() {
        return <div id='body'><h1 className="heading"><b>Welcome to Users Module</b></h1>
            <div><br></br><p className="center-text"><b>Existing Users</b></p></div>
            <br></br>
            <br></br>
            <div className="button-div">
                <a className="a-button" href="./login">Login</a>
            </div>
            <br></br>
            <br></br>
            <p className="center-text"><b> New users </b></p>
            <br></br>
            <br></br>
            <div className="button-div">
                <a className="a-button" href="./register">Register</a>
            </div>
        </div>
    }
}

export default Welcome;