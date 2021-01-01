import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Signup.css";

function Signup() {
  const { register, handleSubmit, errors } = useForm();

  const registration = async (Name,Email, Password) => {
    await fetch("http://localhost:8080/auth/signup/", {
      method: "POST",
      body: JSON.stringify({Name: Name, Email: Email, Password: Password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
       return response.json()
    }).then(data => {
        console.log('response data..',data)
    }).catch(error => {
        console.log(error)
    });
  };

  const onSubmit = async ({ Name, Email, Password }) => {
    // event.preventDefault();
    alert(`${Name} ${Email} ${Password}`);
    registration(Name,Email,Password)
  };
  return (
    <div className="signup">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Sign Up</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="Name"
            className="form-control"
            placeholder="Name"
            ref={register({ required: true, minLength: 3 })}
          />
          {errors.Name && (
            <p className="error-message">
              {" "}
              Name is required and longer than three
            </p>
          )}
        </div>

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
            ref={register({ required: true, minLength: 6 })}
          />
          {errors.Password && (
            <p className="error-message">
              {" "}
              Password is required and longer than five
            </p>
          )}
          {/* {errors.Password?.type === "minLength" && (<p className='error-message'>Password must be at least longest then 5.</p>)} */}
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign Up
        </button>
        <p className="forgot-password text-right">
          Already registered <a href="#">sign in?</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
