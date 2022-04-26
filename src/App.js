import React, { useContext, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";
import Header from "./components/Navbar/Header";
import Footer from "./components/Footer/Footer";
import Signup from "./components/pages/Signup/Signup";
import Login from "./components/pages/Login/Login";
import ForgotPassword from "./components/pages/Forgot Password/ForgotPassword";
import ResetPassword from "./components/pages/Reset Password/ResetPassword";

import AuthContext from "./store/auth-context";
import LoadingSpinner from "./UI/LoadingSpinner";
import classes from "./App.module.css";

const Questions = React.lazy(() =>
  import("./components/pages/Questions/Questions")
);
const QuestionDetails = React.lazy(() =>
  import("./components/pages/Questions/QuestionDetails")
);
const Profile = React.lazy(() => import("./components/pages/Profile/Profile"));
const Jobs = React.lazy(() => import("./components/pages/Jobs/Jobs"));

const JobDetails = React.lazy(() =>
  import("./components/pages/Jobs/JobDetails")
);

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <AuthContextProvider>
      <Header />
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route path="/" exact>
                <Questions />
              </Route>
              <Route path="/question/:questionId">
                <QuestionDetails />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/jobs">
                <Jobs />
              </Route>
              <Route path="/jobdetails/:jobId">
                <JobDetails />
              </Route>
              {!authCtx.isLoggedIn && (
                <Route path="/signup">
                  <Signup />
                </Route>
              )}
              {!authCtx.isLoggedIn && (
                <Route path="/login">
                  <Login />
                </Route>
              )}
              {!authCtx.isLoggedIn && (
                <Route path="/forgotpassword">
                  <ForgotPassword />
                </Route>
              )}

              {!authCtx.isLoggedIn && (
                <Route path="/resetpassword/:token" exact>
                  <ResetPassword />
                </Route>
              )}
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </Suspense>
        </div>
      </div>
      <Footer />
    </AuthContextProvider>
  );
}

export default App;
