import React, { useContext } from "react";
import AuthContext from "../../../store/auth-context";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import classes from "../Question/QuestionModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  const submitCtx = useContext(AuthContext);

  const schema = yup.object().shape({
    answer: yup.string().required("Qusetion is required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const { answer } = data;

    const token = Cookies.get("jwt");
    const userId = localStorage.getItem("userId");
    const questionId = props.questionId;
    console.log(questionId);

    fetch(
      "https://devconnect-backendapp.herokuapp.com/api/v1/answers/postAnswer",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer, userId, questionId }),
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
        props.setIsOpen(false);
        submitCtx.toggleCommentSubmitHandler();
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className={classes.modal}>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label htmlFor="answer">Answer</label>
          <textarea
            rows="10"
            cols="50"
            id="answer"
            name="answer"
            {...register("answer", { required: true })}
          />
          <p className={classes.error}>{errors.answer?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Post Question</button>
        </div>
      </form>
    </div>
  );
};

function AnswerModal(props) {
  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          questionId={props.questionId}
          setIsOpen={props.setIsOpen}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default AnswerModal;
