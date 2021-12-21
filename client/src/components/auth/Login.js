import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Alert from "../layout/Alert";

//Desestructuramos el login para no tener que hacer props.login
const Login = ({ login, isAuthenticated }) => {
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
    login(email, password);
  };

  //Redirect if logged in:
  //Como se ejecuta esta línea de código? Supongamos que cargamos la app inicialmente. No se ejecuta, dado que
  //isAuthenticated = false. Ahora bien, supongamos que el usuario ingresa su mail y su password y se loguea.
  //Dado que en el connect del component estamos determinando que nos queremos subscribir a los cambios del state
  //isAuthenticated, entonces, como esta propiedad del state cambiará de false a true, el componente se re-render.
  //Cuando se re-render y llega a esta línea, entonces isAuthenticated la dará true y entonces redireccionará.
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

//Del estado, me quiero agarrar solo el campo isAuthenticated, para saber si el usuario está autenticado o no.

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

//null -> mapStateToProps
//mapDispatchToProps -> login function. Se pasa la función login como parámetro de mapDispatchToProps.
export default connect(mapStateToProps, { login })(Login);
