import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../store/auth-context";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./Signup.module.css";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(8, "Password must be atleast 8 characters long!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match"),
});

function Signup() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    const name = data.name;
    const email = data.email;
    const password = data.password;
    const passwordConfirm = data.passwordConfirm;

    console.log(name, email, password, passwordConfirm);

    fetch("https://devconnect-backendapp.herokuapp.com/api/v1/users/signup", {
      body: JSON.stringify({ name, email, password, passwordConfirm }),
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            const errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.token);
        localStorage.setItem("userId", data.data.user._id);
        history.replace("/questions");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <div className={classes.title}>
          <h3>Sign Up</h3>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", {
              required: true,
            })}
          />
          <p className={classes.error}>{errors.name?.message}</p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            {...register("password", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            {...register("passwordConfirm", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.passwordConfirm?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">SignUp</button>
        </div>
        <div className={classes.options}>
          <p>Already have an account?</p>
          <p>
            <span onClick={() => history.push("/login")}>Click here</span> to
            Login
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
