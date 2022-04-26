import React, { useState, useEffect } from "react";
import QuestionsList from "./QuestionsList";
import axios from "axios";
import classes from "./Questions.module.css";

function Questions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/questions/getAllQuestions"
      );
      const { data } = response.data;
      setQuestions(data.questions);
    };

    loadQuestions();
  }, []);

  let questionsData;

  if (questions.length > 0) {
    questionsData = questions.map((question) => (
      <QuestionsList
        key={question._id}
        id={question._id}
        questionExplanation={question.questionExplanation}
        question={question.question}
        user={question.user}
        tag={question.tag}
        answers={question.answers}
        createdAt={question.createdAt}
      />
    ));
  }

  return (
    <div>
      <div className={classes.title}>
        <h3>Questions</h3>
      </div>
      <div className={classes.container}>{questionsData}</div>
    </div>
  );
}

export default Questions;
