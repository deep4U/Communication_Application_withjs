import React from "react";

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.state;
    }

    // validate form data format and validity
    validateData(email, name, password, confirmPassword) {
        if (name === "") {
            alert("Please enter name");
            return false;
        }
        else if (email === "") {
            alert("Please enter email");
            return false;
        }
        else if (!email.includes('@') || !email.includes('.')) {
            alert("Please enter valid email");
            return false;
        } else if (password === "") {
            alert("Please enter password");
            return false;
        }
        else if (confirmPassword === "") {
            alert("Please enter confirm password");
            return false;
        }
        if (password !== confirmPassword) {
            alert("password and confirm password are not same!");
            return false;
        }
        else if (password.length < 8) {
            alert("Password too short! Min 8 characters are required!");
            return false;
        }
        return true;
    }

    // check password and email id against storage for login
    checkPassword(email, password, storageMap) {
        for (let user of storageMap) {
            if (user.email === email) {
                if (user.password === password) {
                    // if credentials match then store in loggedin
                    let { password, confirmPassword, ...loggedUser } = user;
                    localStorage.setItem('loggedin', JSON.stringify(loggedUser));
                    return true;
                }
                else {
                    return "Wrong Email or Password";
                }
            }
        }
        return "Wrong Email or Password";
    }

    loginForm = (event) => {
        event.preventDefault();
        // load users localStorage
        let users = this.state.users;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        // validate data from user send dummy name
        if (!this.validateData(email, 'name', password, password)) {
            return false;
        }
        // check credentials if they match the localstorage then login the user
        let ret = this.checkPassword(email, password, users)
        if (typeof (ret) === "string") {
            alert(ret);
            return false;
        }
        else
            console.log('shoud login', ret)
        window.location.href = '/login-success'
        return ret;
    }

    render() {
        return <div id='body'>
            <br></br>
            <br></br>
            <form className="loginform" action="/login-success" onSubmit={this.loginForm} method="POST">
                <table className="form-table" cellPadding="10px" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td>
                            </td>
                            <td>
                                <h1 className="heading"><b>Login</b></h1>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-col"> <b>Email</b> </td>
                            <td><input type="text" name="Email" id="email" defaultValue="anne.hunter@mail.com" className="text-box" /></td>
                        </tr>
                        <tr>
                            <td className="text-col"><b>Password</b></td>
                            <td><input type="password" name="Password" id="password" defaultValue="*****" className="text-box" /></td>
                        </tr>
                        <tr>
                            <td className="text-col"></td>
                            <td className="submit-col">
                                <button className="submit-button" type="submit" defaultValue="Login" onClick={this.redirect}>Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    }
}

export default Login;