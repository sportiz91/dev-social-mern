//racf -> snippet para react arrow functional component. Diferente a rfc -> react functional component.
//Por ahora tendremos static html. Luego tendremos un componente dinámico que se actualiza tomando state de redux, pero por ahora será estático.

import React from "react";

export const Navbar = () => {
  return (
    <div>
      <nav className="navbar bg-dark">
        <h1>
          <a href="dashboard.html">
            <i className="fas fa-code"></i> DevConnector
          </a>
        </h1>
        <ul>
          <li>
            <a href="developers.html">Developers</a>
          </li>
          <li>
            <a href="register.html">Register</a>
          </li>
          <li>
            <a href="login.html">Login</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
