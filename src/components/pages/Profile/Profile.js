import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../../store/auth-context";
import QuestionModal from "../../Modal/Question/QuestionModal";
import axios from "axios";
import AuthenticationModal from "../../Modal/Authentication/AuthenticationModal";
import classes from "./Profile.module.css";
import UserQuestions from "./UserQuestions";

function Profile() {
  const [user, setUser] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const authCtx = useContext(AuthContext);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/users/getAllUsers"
      );
      const { data } = response.data;

      const filteredUser = data.users.filter((user) => user._id === userId);
      setUser(filteredUser);
    };
    loadUsers();
  }, []);

  const openHandler = (e) => {
    e.preventDefault();
    authCtx.isLoggedIn ? setIsOpen(!isOpen) : alert("Please Login");
  };

  return (
    <div>
      <div className={classes.profile}>
        <h4>My Profile</h4>
        {user.map((user) => {
          return (
            <div className={classes.userDetails} key={user._id}>
              <p>Name - {user.name}</p>
              <p>Email - {user.email}</p>
              <div className={classes.btn}>
                <button onClick={openHandler}>Ask a question</button>
                {authCtx.isLoggedIn ? (
                  isOpen && <QuestionModal onConfirm={openHandler} />
                ) : (
                  <AuthenticationModal onConfirm={openHandler} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <UserQuestions />
    </div>
  );
}

export default Profile;
