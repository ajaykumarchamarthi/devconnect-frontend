import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./QuestionsList.module.css";

function QuestionsList({
  id,
  question,
  questionExplanation,
  user,
  tag,
  answers,
  createdAt,
}) {
  const history = useHistory();
  return (
    <div className={classes.questionContainer}>
      <div className={classes.aboutQuestion}>
        <p className={classes.answers}>{answers.length} - answers</p>
      </div>
      <div className={classes.question}>
        <h3
          onClick={() => history.push(`/question/${id}`)}
          className={classes.questionTitle}
        >
          {question}
        </h3>
        <p className={classes.questionExplanation}>
          {questionExplanation.slice(0, 100)}...{" "}
          <span
            className={classes.readMore}
            onClick={() => history.push(`/question/${id}`)}
          >
            read more
          </span>
        </p>
      </div>
      <div className={classes.aboutQuestion}>
        <span className={classes.tag}>{tag}</span>
        <p>
          <span className={classes.name}>{user.name}</span> asked -{" "}
          <span>
            {new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }).format(new Date(createdAt))}
          </span>
        </p>
      </div>
    </div>
  );
}

export default QuestionsList;
