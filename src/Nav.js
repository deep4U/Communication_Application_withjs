import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
// const Nav = (props) => {
import React from "react";

export class Nav extends React.Component { //export class

    componentDidMount = () => {
        if (this.props.current)
            document.getElementById(this.props.current).className = "nav-button-current"
    }

    render(props) {
        return <>
            <nav className="nav-bar navbar-expand-sm navbar-dark  ">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-button" id='chat' to="/chat">Group Chat</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-button" id='users-list' to="/users-list">Manage Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-button" id='documents-list' to="/documents-list">Manage Documents</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-button" id='logout' to="/logout">Logout</Link>
                        </li>
                    </ul>

                </div>
            </nav>
            <Outlet />
        </>;
    }
}
export default Nav;