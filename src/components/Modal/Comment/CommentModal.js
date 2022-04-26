import React from "react";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import classes from "./CommentModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  const schema = yup.object().shape({
    comment: yup.string().required("Comment is required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const { comment } = data;

    const token = Cookies.get("jwt");
    const userId = localStorage.getItem("userId");
    const answerId = props.answerId;

    fetch(
      "https://devconnect-backendapp.herokuapp.com/api/v1/answers/postComment",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, userId, answerId }),
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
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className={classes.modal}>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <div className={classes.div}>
          <label htmlFor="comment">Comment</label>
          <textarea
            rows="10"
            cols="70"
            id="comment"
            name="comment"
            {...register("comment", { required: true })}
          />
          <p className={classes.error}>{errors.comment?.message}</p>
        </div>

        <div className={classes.btn}>
          <button type="submit" onClick={props.onConfirm}>
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

function CommentModal(props) {
  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay onConfirm={props.onConfirm} answerId={props.answerId} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default CommentModal;
