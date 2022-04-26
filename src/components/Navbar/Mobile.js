import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink, Link } from "react-router-dom";
import classes from "./Mobile.module.css";

function Mobile({ isOpen, setIsOpen }) {
  const authCtx = useContext(AuthContext);
  return (
    <div className={classes.mobile}>
      <div onClick={() => setIsOpen(!isOpen)} className={classes.closeIcon}>
        <AiOutlineClose size={24} />
      </div>
      <div className={classes.mobileOption}>
        <ul className={classes.mobileOptions}>
          <li>
            <NavLink to="/" exact activeClassName={classes.active}>
              Questions
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" activeClassName={classes.active}>
              Jobs
            </NavLink>
          </li>
          {authCtx.isLoggedIn && (
            <li>
              <NavLink to="/profile" activeClassName={classes.active}>
                Profile
              </NavLink>
            </li>
          )}
          {!authCtx.isLoggedIn && (
            <li>
              <Link to="/login">
                <span className={classes.btn}>Login</span>
              </Link>
            </li>
          )}
          {authCtx.isLoggedIn && (
            <li>
              <span className={classes.btn} onClick={() => authCtx.logout()}>
                Logout
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Mobile;
