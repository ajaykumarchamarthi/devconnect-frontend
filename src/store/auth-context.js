import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  isQuestionSubmitted: false,
  toggleQuestionSubmitHandler: () => {},
  isAnswerSubmitted: false,
  toggleAnswerSubmitHandler: () => {},
  isCommentSubmitted: false,
  toggleCommentSubmitHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const history = useHistory();
  const cookies = Cookies.get("jwt");
  const userIsLoggedIn = !!cookies;

  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);

  const [token, setToken] = useState(cookies);

  const logoutHandler = () => {
    Cookies.remove("jwt");
    setToken(null);
    localStorage.removeItem("userId");
    history.replace("/");
  };

  const loginHandler = (token) => {
    Cookies.set("jwt", token, { expires: 7, path: "/" });
    setToken(token);
  };

  const toggleQuestionSubmitHandler = () => {
    setIsQuestionSubmitted(!isQuestionSubmitted);
  };

  const toggleAnswerSubmitHandler = () => {
    setIsAnswerSubmitted(!isAnswerSubmitted);
  };

  const toggleCommentSubmitHandler = () => {
    setIsCommentSubmitted(!isCommentSubmitted);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    isQuestionSubmitted: isQuestionSubmitted,
    toggleQuestionSubmitHandler: toggleQuestionSubmitHandler,
    isAnswerSubmitted: isAnswerSubmitted,
    toggleAnswerSubmitHandler: toggleAnswerSubmitHandler,
    isCommentSubmitted: isCommentSubmitted,
    toggleCommentSubmitHandler: toggleCommentSubmitHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
