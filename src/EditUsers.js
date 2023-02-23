import React from "react";
import Nav from "./Nav";

export class EditUsers extends React.Component { //export class

    constructor(props) {
        super(props);
        // get localstorage values loaded via Main from props
        this.state = props.state;
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

    // get full name and email id of given user for edit modal
    getFullNameEmail(users, id) {
        for (let user of users) {
            if (user.id == id) {
                return [user.name, user.email];
            }
        }
        return false;
    }

    // users table for edit page
    getEditTable = (event) => {
        // get user id from search params
        const querry = window.location.search;
        const urlParams = new URLSearchParams(querry);
        let id = urlParams.get('id');
        // get full name and email and save button for 
        // that user and add in form table
        const users = this.state.users;
        console.log(users, 'is current users storage')
        let retNameEmail = this.getFullNameEmail(users, id)
        console.log(retNameEmail, "is current data")
        return <tbody>
            <tr>
                <td></td>
                <td>
                    <h3 className="heading"><b>Edit User Information</b>
                        <p></p>
                    </h3>
                </td>
            </tr>
            <tr>
                <td className='text-col'><b>Full Name</b></td>
                <td><input className='text-box' type='text' name='name' id='name' defaultValue={retNameEmail[0]}>
                </input>
                </td>
            </tr>
            <tr>
                <td className='text-col'><b>Email</b></td>
                <td><input className='text-box' type='text' name='email' id='email' defaultValue={retNameEmail[1]}></input></td>
            </tr>
            <tr>
                <td>
                </td>
                <div className='submit-button-div'>
                    <td><input type='submit' name='save' className='submit-button' onClick={this.editUser}></input></td>
                </div>
            </tr>
        </tbody>
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

    // edit user email and name from input elements
    editUser = (event) => {
        // get id of user to be editted from searchparams
        const querry = window.location.search;
        const urlParams = new URLSearchParams(querry);
        let id = urlParams.get('id');
        // load users and loggedin storage
        let users = this.state.users;
        let loggedin = this.state.loggedin;
        // get new email id and name from edit text inputs boxes
        let email = document.getElementById('email').value;
        let name = document.getElementById('name').value;
        // validate email and name formats send some dummy password
        if (!this.validateData(email, name, 'password', 'password')) {
            console.log('returning false');
            event.preventDefault();
            return false;
        }
        else {
            // go through all users and find the user to be modefied
            for (let user of users) {
                if (user.id == id) {
                    if (user.email != email) {
                        // email should not be already in use
                        if (this.validateEmail(email, users)) {
                            alert("User already exists");
                            event.preventDefault();
                            return false;
                        }
                        user.email = email;
                    }
                    // change user's email and name and store in localstorage
                    user.name = name;
                    localStorage.setItem('users', JSON.stringify(users));
                    // if loggedin user was changed then loggedin localstorage needs to be modefied too
                    if (user.id == loggedin.id) {
                        let { password, confirmPassword, ...loggedUser } = user;
                        localStorage.setItem('loggedin', JSON.stringify(loggedUser));
                    }
                    return true;
                }
            }
        }
    }

    render() {
        return <div id='body'>
            {this.checkLogin()}
            <Nav current='users-list'></Nav>
            <form id="edit-form" action='./users-list' className="edit-form" >
                <table className="form-table" id="form-table" cellPadding="15">
                    {this.getEditTable()}
                </table>
            </form>
        </div>
    }
}

export default EditUsers;