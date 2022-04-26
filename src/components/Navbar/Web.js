import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { NavLink, Link } from "react-router-dom";
import classes from "./Web.module.css";

function Web() {
  const authCtx = useContext(AuthContext);
  return (
    <div className={classes.web}>
      <ul className={classes.webOptions}>
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
  );
}

export default Web;
