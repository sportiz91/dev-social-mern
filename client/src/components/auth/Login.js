import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  // console.log("re-render"); -> desactivar para ver la cantidad de re-renders del functional component.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    // console.log(`e: ${e}`);
    // console.log(`e.target: ${e.target}`);
    // console.log(typeof e.target);
    // console.log(`e.target.name: ${e.target.name}`);
    // console.log(`e.target.value: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(`SUCCESS! ${formData}`);
  };

  return (
    <section className="container">
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
