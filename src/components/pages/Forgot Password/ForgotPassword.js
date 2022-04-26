import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classes from "./ForgotPassword.module.css";

const Schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
});

function ForgotPassword() {
  const history = useHistory();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    const email = data.email;

    fetch("https://insta-blogapp.herokuapp.com/api/v1/users/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            const errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert(data.status);
        history.replace("/");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <div className={classes.title}>
          <h3>Forgot Password</h3>
          <p>No worries! Enter your email and we will send you a reset.</p>
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          <p className={classes.error}>{errors.email?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Send Reset Email</button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
