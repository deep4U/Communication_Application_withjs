import React from "react";
export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }

    // check if email exists already in users storage
    validateEmail(email, storageMap) {
        for (let userObject of storageMap) {
            if (userObject.email === email) {
                console.log(
                    userObject.email, "and ", email, "exist already"
                )
                return true;
            }
        }
        return false;
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


    // register the user with given data
    registerUser = (event) => {
        // load users storage
        let users = this.state.users;
        // get data from form inputs
        let email = document.getElementById('email').value;
        let password = document.getElementById('pass').value;
        let name = document.getElementById('name').value;
        let confirmPassword = document.getElementById('confirmPass').value;
        // validate data
        if (!this.validateData(email, name, password, confirmPassword)) {
            event.preventDefault();
            return false;
        }
        // validate email does not already exist in localstorage of users
        if (this.validateEmail(email, users)) {
            event.preventDefault();
            alert("User already exists");
            return false;
        }
        // add new user to localstorage
        let newUser = {
            id: Number(new Date()),
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };
        users.push(newUser);
        let usersString = JSON.stringify(users);
        localStorage.setItem('users', usersString);
        return true;
    }

    render() {
        return <div id='body'>
            <form className="loginform" action="/register-success" method="get" onSubmit={this.registerUser}>
                <table className="form-table" cellPadding="10" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <h1 className="heading">Register</h1>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-col"><b>Full Name</b></td>
                            <td>
                                <input type="text" name="name" id="name" className="text-box" />
                            </td>
                        </tr>
                        <tr>
                            <td className="text-col"><b>Email</b></td>
                            <td>
                                <input type="text" name="email" id="email" className="text-box" />
                            </td>
                        </tr>
                        <tr>
                            <td className="text-col"><b>Password</b></td>
                            <td>
                                <input type="password" name="password" id="pass" className="text-box" />
                            </td>
                        </tr>
                        <tr>
                            <td className="text-col"> <b>Confirm Password</b></td>
                            <td>
                                <input type="password" name="confirmPassword" id="confirmPass" className="text-box" />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="submit-col">
                                <input className="submit-button" type="submit" name="Register" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    }
}

export default Register;