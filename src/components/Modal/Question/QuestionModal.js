import React from "react";
import { useHistory } from "react-router-dom";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import classes from "./QuestionModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  const history = useHistory();

  const schema = yup.object().shape({
    question: yup.string().required("Question is required"),
    questionExplanation: yup
      .string()
      .required("Question Explanation is required"),
    tag: yup.string().required("Tag is required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const { question, tag, questionExplanation } = data;

    const token = Cookies.get("jwt");

    const userId = localStorage.getItem("userId");

    fetch(
      "https://devconnect-backendapp.herokuapp.com/api/v1/questions/postQuestion",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, questionExplanation, tag, userId }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert(data.status);
        history.go("/profile");
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className={classes.modal}>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label htmlFor="question">Question</label>
          <textarea
            rows="3"
            cols="50"
            id="question"
            name="question"
            {...register("question", { required: true })}
          />
          <p className={classes.error}>{errors.question?.message}</p>
        </div>
        <div>
          <label htmlFor="questionExplanation">Question Explanation</label>
          <textarea
            rows="10"
            cols="50"
            id="questionExplanation"
            name="questionExplanation"
            {...register("question", { required: true })}
          />
          <p className={classes.error}>{errors.questionExplanation?.message}</p>
        </div>
        <div>
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            id="tag"
            name="tag"
            {...register("tag", { required: true })}
          />
          <p className={classes.error}>{errors.tag?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Ask Question</button>
        </div>
      </form>
    </div>
  );
};

function QuestionModal(props) {
  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay onConfirm={props.onConfirm} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default QuestionModal;
