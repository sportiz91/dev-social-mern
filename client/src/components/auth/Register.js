//For every form i'll be using local state.
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import Alert from "../layout/Alert";

const Register = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // console.log("re-render"); -> see the # of re-render of the component.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    // console.log(`e.target: ${e.target}`); -> returns [object HTMLInputElement].
    // that's why we desestructure [e.target.name]
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert("Password do not match", "danger"));
    } else {
      // console.log({ name, email, password }); returns -> {name: 'Name', email: 'email@gmail.com', password: 'xxxxxx'}
      //We pass the variables as an object with variables cuz register function desestructure an object.
      dispatch(register({ name, email, password }));
    }
  };

  //When we registered successfully, this component will be re-loaded and this conditional will apply. So, we are not be able to see the Register component
  //anymore. The, profile_error action will be shoted because when we register for the first time we don't have a profile.
  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  //For every input: name = name of the variable we defined in state. value = state. Calls onChange
  return (
    <section className="container">
      <Alert />
      <h1 className="text-l text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>

        <small className="form-text">
          This site uses Gravatar, so if you want a profile image, use a
          Gravatar email
        </small>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password2"
            value={password2}
            placeholder="Confirm Password"
            onChange={(e) => onChange(e)}
          />
        </div>
        <input
          className="btn btn-primary my-1"
          type="submit"
          value="Register"
        />
        <p>
          Already have an account?
          <Link to="/login" className="text-primary">
            &nbsp;Sign In
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
