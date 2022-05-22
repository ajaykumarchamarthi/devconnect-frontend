import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";
import CommentModal from "../../../Modal/Comment/CommentModal";
import Cookies from "js-cookie";
import { FaThumbsUp } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa";
import classes from "./AnswerDetailsList.module.css";

function AnswerDetailsList({ id }) {
  const [answers, setAnswers] = useState([]);
  const [like, setLike] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const authCtx = useContext(AuthContext);

  const token = Cookies.get("jwt");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadAnswers = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/answers/getAllAnswers?sort=-likes"
      );
      const { data } = response.data;

      const filteredAnswer = data.answers.filter(
        (answer) => answer.question._id === id
      );

      setAnswers(filteredAnswer);
    };

    loadAnswers();
  }, [like, id]);

  const openHandler = (event) => {
    event.preventDefault();
    authCtx.isLoggedIn ? setIsOpen(!isOpen) : alert("Please Login");
  };

  const likeAnswer = (answerId, userId) => {
    authCtx.isLoggedIn
      ? fetch(
          "https://devconnect-backendapp.herokuapp.com/api/v1/answers/like",
          {
            method: "PATCH",
            body: JSON.stringify({ answerId, userId }),
            headers: {
              "content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              return res.json().then((data) => {
                const errorMessage = `${data.message}`;
                throw new Error(errorMessage);
              });
            }
          })
          .then((data) => {
            setLike((prevLike) => !prevLike);
          })
          .catch((err) => alert(err.message))
      : alert("Please Log In");
  };

  const unlikeAnswer = (answerId, userId) => {
    fetch("https://devconnect-backendapp.herokuapp.com/api/v1/answers/unlike", {
      method: "PATCH",
      body: JSON.stringify({ answerId, userId }),
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            const errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log("unLiked", userId);
        setLike((prevLike) => !prevLike);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <>
      {answers.map((answer) => {
        return (
          <div className={classes.Container} key={answer._id}>
            <div className={classes.answer}>
              <div className={classes.likeContainer}>
                {answer.likes.find((user) => user._id === userId) ? (
                  <FaThumbsUp
                    color="#3b5998"
                    size={32}
                    className={classes.icon}
                    onClick={() => unlikeAnswer(answer._id, userId)}
                  />
                ) : (
                  <FaRegThumbsUp
                    color="grey"
                    size={32}
                    className={classes.icon}
                    onClick={() => likeAnswer(answer._id, userId)}
                  />
                )}
                <p>
                  {answer.likes.length} - users
                  <br /> found useful
                </p>
              </div>
              <div className={classes.answerContainer}>
                <p className={classes.answerContent}>{answer.answer}</p>
                <div className={classes.answeredBy}>
                  <p>
                    {answer.user.name} -{" "}
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      }).format(new Date(answer.createdAt))}
                    </span>
                  </p>
                </div>
                <div className={classes.commentContainer}>
                  <hr className={classes.hr} />
                  {answer.comments.map((comment) => {
                    return (
                      <div key={comment._id}>
                        <p className={classes.comment}>
                          {comment.comments} -{" "}
                          <span className={classes.name}>
                            {comment.user.name}{" "}
                          </span>
                          <span>
                            {/* {new Intl.DateTimeFormat("en-GB", {
                              year: "numeric",
                              month: "long",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                            }).format(new Date(comment.createdAt))} */}
                          </span>
                        </p>
                      </div>
                    );
                  })}

                  <button className={classes.btn} onClick={openHandler}>
                    Add a Comment
                  </button>
                  {isOpen && (
                    <CommentModal
                      onConfirm={openHandler}
                      setIsOpen={setIsOpen}
                      answerId={answer._id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default AnswerDetailsList;
