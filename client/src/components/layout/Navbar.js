//racf -> snippet para react arrow functional component. Diferente a rfc -> react functional component.
//Por ahora tendremos static html. Luego tendremos un componente dinámico que se actualiza tomando state de redux, pero por ahora será estático.
//En react no queremos usar los clásicos anchor tags. Lo que queremos usar son los links (que son anchor tags en el fondo), para pontear a nuestra App.

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm">Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="#!">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  //Si miramos el reducer, vemos que loading es true por default. Cuando fetcheamos el user u obtenemos un error,
  //Loading se muestra como falso. Queremos asegurarnos que loading sea false antes de mostrar el menú.
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
