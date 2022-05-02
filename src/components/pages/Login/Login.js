import React, { useContext } from "react";
import AuthContext from "../../../store/auth-context";
import classes from "./Login.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(8, "Password must be atleast 8 Characters long!"),
});

function Login() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    const email = data.email;
    const password = data.password;

    fetch("https://devconnect-backendapp.herokuapp.com/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-Type": "application/json",
      },
    })
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
        authCtx.login(data.token);
        localStorage.setItem("userId", data.data.user._id);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <p className={classes.testCredential}>
          Test Credentials: ajayaj0302@gmail.com & ajay1234
        </p>
        <div>
          <h3 className={classes.title}>Login</h3>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            {...register("email", { required: true })}
          />
          <p className={classes.error}>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            name="password"
            {...register("password", { required: true })}
          />
          <p className={classes.error}>{errors.password?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Login</button>
        </div>
        <hr />
        <div className={classes.options}>
          <p className={classes.optionsHeading}>Forgot your password?</p>
          <p className={classes.optionsText}>
            <span
              onClick={() => {
                history.push("/forgotpassword");
              }}
            >
              Click here{" "}
            </span>
            to reset your password
          </p>
        </div>
        <hr />
        <div className={classes.options}>
          <p className={classes.optionsHeading}>Don't have an account?</p>
          <p className={classes.optionsText}>
            <span onClick={() => history.push("/signup")}>Click here</span> to
            Register
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
