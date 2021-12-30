//Because we are in a form, we use local state (useState).
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
import Alert from "../layout/Alert";

const Register = ({ setAlert, register, isAuthenticated }) => {
  // console.log("re-render"); -> desactivar para ver la cantidad de re-renders del functional component.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  //Importante destacar, el [e.target.name] lo tenemos que desestructurar como array. Si nos fijamos
  //El console.log del e.target, veremos que nos da [object HTMLInputElement], es decir,
  //Un array que adentro tiene un objeto HTMLInputElement, donde las propiedades vendrían a ser los atributos
  //Determinados en el HTML Input Element.

  const onChange = (e) => {
    // console.log(`e.target: ${e.target}`); -> returns [object HTMLInputElement].
    // that's why we desestructure [e.target.name]
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Password do not match", "danger");
    } else {
      // console.log({ name, email, password }); returns -> {name: 'Name', email: 'email@gmail.com', password: 'xxxxxx'}
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps, { setAlert, register })(Register);
