// @ts-nocheck
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import GoogleLogin from "react-google-login";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./globalState/StateProvider";
import "./Login.css";

function Login() {
  const { register, handleSubmit, errors } = useForm();
  const [{ user, books }, dispatch] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/sign-up");
    }
    return () => {};
  }, []);
  
  const login = async (Email, Password) => {
    await fetch("http://localhost:8080/auth/login/", {
      method: "POST",
      body: JSON.stringify({ Email: Email, Password: Password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        // alert(`Token: ${data}`)
        await dispatch({
          type: "SET_USER",
          user: data.user
        });
        history.push("/books");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async ({ Email, Password }) => {
    // event.preventDefault();
    //alert(`${Email} ${Password}`);
    login(Email, Password);
  };

  const responseSuccessGoogle = (response) => {
    //console.log('response..',response)
    fetch("http://localhost:8080/auth/googlelogin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: response.tokenId }),
    })
      .then((user) => {
        return user.json();
      })
      .then((data) => {
        dispatch({
          type: "SET_USER",
          user: data.user,
        });
        history.push("/books");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const responseFailureGoogle = (response) => {};

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Sign In</h3>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="Email"
              className="form-control"
              placeholder="Enter email"
              ref={register({ required: true, pattern: /\S+@\S+\.\S+/ })}
            />
            {errors.Email?.type === "required" && (
              <p className="error-message"> Email is required</p>
            )}
            {errors.Email?.type === "pattern" && (
              <p className="error-message">Invalid Email</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              className="form-control"
              placeholder="Enter password"
              ref={register({ required: true })}
            />
            {errors.Password && (
              <p className="error-message"> Password is required</p>
            )}
          </div>

          {/* <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div> */}

          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          <div className="text-center">
            <GoogleLogin
              clientId="819867897528-fgr4r0oej769ssbu1ivnp44ppqoafplt.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseFailureGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
          <p className="forgot-password text-right">
            Not registered! <Link to="/sign-up">sign up?</Link>
          </p>
          {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
