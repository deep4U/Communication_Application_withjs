import React from "react";
export class LogOut extends React.Component {

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
        localStorage.removeItem('loggedin');
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad)
    }

    handleLoad() {
        localStorage.removeItem('loggedin');
    }

    render() {
        return <div id='body'><h1 className="heading"><b>Welcome to Users Module</b></h1>
            <div><br></br><p className="center-text"><b>Existing Users</b></p></div>
            <br></br>
            <br></br>
            <div className="button-div">
                <a className="a-button" href="/login">Login</a>
            </div>
            <br></br>
            <br></br>
            <p className="center-text"><b> New users </b></p>
            <br></br>
            <br></br>
            <div className="button-div">
                <a className="a-button" href="/register">Register</a>
            </div>
            <br></br>
            <br></br>
            <p class="heading"><b>You have been logged out</b></p>
        </div>
    }
}

export default LogOut;