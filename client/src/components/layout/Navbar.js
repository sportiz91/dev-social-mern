//racf -> snippet para react arrow functional component. Diferente a rfc -> react functional component.
//Por ahora tendremos static html. Luego tendremos un componente dinámico que se actualiza tomando state de redux, pero por ahora será estático.
//En react no queremos usar los clásicos anchor tags. Lo que queremos usar son los links (que son anchor tags en el fondo), para pontear a nuestra App.

import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/dashboard">
            <i className="fas fa-code"></i> DevConnector
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/developers">Developers</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
