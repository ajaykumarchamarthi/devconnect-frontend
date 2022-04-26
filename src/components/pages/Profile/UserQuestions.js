import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./UserQuestion.module.css";

function UserQuestions() {
  const [questions, setQuestions] = useState([]);

  const history = useHistory();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/questions/getAllQuestions"
      );
      const { data } = response.data;

      const filteredQuestion = data.questions.filter(
        (question) => question.user._id === userId
      );
      setQuestions(filteredQuestion);
    };
    loadQuestions();
  }, []);

  return (
    <>
      <div className={classes.userQuestion}>
        <p>Questions Asked By You</p>
        <div>
          {questions.length === 0 && (
            <div className={classes.questionsList}>
              <p className={classes.noQuestion}>No questions to show...</p>
            </div>
          )}
        </div>
        <div>
          {questions.map((question) => {
            return (
              <div className={classes.questionsList} key={question._id}>
                <p
                  onClick={() => history.replace(`/question/${question._id}`)}
                  className={classes.question}
                >
                  {question.question}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default React.memo(UserQuestions);
