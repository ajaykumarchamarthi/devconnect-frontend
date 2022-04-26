import React, { useState, useEffect, useContext } from "react";
import AnswerDetailsList from "./Answers/AnswerDetailsList";
import AnswerModal from "../../Modal/Answer/AnswerModal";
import AuthContext from "../../../store/auth-context";
import axios from "axios";
import { useParams } from "react-router-dom";
import classes from "./QuestionDetail.module.css";

function QuestionDetails() {
  const [question, setQuestion] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const authCtx = useContext(AuthContext);

  const params = useParams();
  const id = params.questionId;

  // {new Intl.DateTimeFormat("en-GB", {
  //   year: "numeric",
  //   month: "long",
  //   day: "2-digit",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  // }).format(new Date(answer.createdAt))}

  useEffect(() => {
    console.log(id);
    const loadQuestions = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/questions/getAllQuestions"
      );
      const { data } = response.data;

      const filteredQuestion = data.questions.filter(
        (question) => question._id === id
      );
      setQuestion(filteredQuestion);
    };

    loadQuestions();
  }, [id]);

  const openHandler = (event) => {
    event.preventDefault();
    authCtx.isLoggedIn ? setIsOpen(!isOpen) : alert("Please Login");
  };

  return (
    <>
      <div className={classes.questionContainer}>
        {question.map((question) => {
          return (
            <div key={question._id}>
              {/* <div className={classes.aboutQuestion}>
              <p className={classes.answers}>
                {question.answers.length} - answers
              </p>
            </div> */}
              <div className={classes.question}>
                <h3 className={classes.questionTitle}>{question.question}</h3>
                <p className={classes.questionExplanation}>
                  {question.questionExplanation}
                </p>
              </div>
              <div className={classes.aboutQuestion}>
                <span className={classes.tag}>{question.tag}</span>
                <p>
                  <span className={classes.name}>{question.user.name}</span>{" "}
                  asked -{" "}
                  <span>
                    {new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    }).format(new Date(question.createdAt))}
                  </span>
                </p>
              </div>
              <div className={classes.answer}>
                <button className={classes.btn} onClick={openHandler}>
                  Say Answer
                </button>
                {authCtx.isLoggedIn && isOpen && (
                  <AnswerModal onConfirm={openHandler} questionId={id} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <AnswerDetailsList id={id} />
    </>
  );
}

export default QuestionDetails;
