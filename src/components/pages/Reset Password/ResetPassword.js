import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./ResetPassword.module.css";

const Schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must atleast 6 characters long")
    .max(15)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

function ResetPassword() {
  const history = useHistory();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const password = data.password;
    const passwordConfirm = data.confirmPassword;

    const token = params.token;

    fetch(
      `https://devconnect-backendapp.herokuapp.com/api/v1/users/resetPassword/${token}`,
      {
        method: "PATCH",
        body: JSON.stringify({ password, passwordConfirm }),
        headers: {
          "content-Type": "application/json",
        },
      }
    )
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
          <h3>Reset Password</h3>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            {...register("password", {
              required: true,
            })}
          />
          <p className={classes.error}>{errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            {...register("confirmPassword", {
              required: true,
            })}
          />
          <p className={classes.error}>{errors.confirmPassword?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Reset Password</button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
