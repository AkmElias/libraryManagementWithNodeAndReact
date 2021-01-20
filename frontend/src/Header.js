// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,

  Link,
  useHistory,
} from "react-router-dom";
import "./Header.css";
import { useStateValue } from "./globalState/StateProvider";

function Header() {
  const userFromLocal = JSON.parse(localStorage.getItem('user'))
  const [{user}, dispatch] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    // localStorage.setItem("user", null);
    // localStorage.removeItem("user");
    console.log("user: ", user);
    return () => {};
  }, []);
  const logout = () => {
    localStorage.removeItem("user");
    dispatch({
      type: 'SET_USER',
      user: null
    })
    history.push("/sign-in");
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand btn" to={"/"}>
            <h5 className="">Library Management</h5>
          </Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              {!user &&  userFromLocal === null &&(
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>
                    Login
                  </Link>
                </li>
              )}

              {!user && userFromLocal === null &&(
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>
                    Register
                  </Link>
                </li>
              )}
              {/* {user && (<li className="nav-item btn bookmark"><Link to='/books'><FavoriteIcon /></Link></li>)} */}
              {user || userFromLocal !== null && (
                <li className="nav-item btn">
                  <Link to="/" className="user-name">
                    {user ? user.name : userFromLocal.name}
                  </Link>
                </li>
              )}
              {user || userFromLocal !== null && (
                <li className="nav-item btn btn-primary" onClick={logout}>
                  Logout
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
