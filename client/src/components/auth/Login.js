import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import Alert from "../layout/Alert";

const Login = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  //If user isAuthenticated, then, navigate to dashboard.
  //LOGIN_SUCCESS -> USER_LOADED -> GET_PROFILE actions shot.
  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <section className="container">
      <Alert />
      <h1 className="text-l text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>

        <input className="btn btn-primary my-1" type="submit" value="Login" />
        <p>
          Don't have an account?
          <Link to="/register" className="text-primary">
            &nbsp;Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
