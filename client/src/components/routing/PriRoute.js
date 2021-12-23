//Este componente fue creado con el objetivo de hacer algunas routes privadas. Ej: Dashboard component.
//De no existir este componente, un usuario podría iniciar sesión, ver el dashboard, cerrar sesión, ir para atrás y seguir viendo el Dashboard component.
//No queremos que ocurra eso.
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

//al PriRoute component se le pasa la prop especial children. Esta prop contendrá los components que vengan por debajo de PriRoute.
//Notar que PriRoute pregunta si NO estamos autenticados Y SI NO está cargando. Llegado ese caso, se carga la página de login, dado quee hay
//que proteger la ruta. Sino, se carga el children prop, que contiene los childs components. El child component de PriRoute es <Dashboard />
//Como podemos ver de App.js component.
//Ver: https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
//Entonces, cualquier ruta que queramos proteger, podemos usar el PriRoute component, en vez del Route.
//Acá entra en juego el children prop! debido que los children component de PriRoute irán cambiando a medida quiera proteger diferentes
//Rutas, children considerará cualquiera de esos children component.
const PriRoute = ({ auth: { isAuthenticated, loading }, children }) => {
  return !isAuthenticated && !loading ? (
    <Navigate replace to="/login" />
  ) : (
    children
  );
};

//Recordemos que auth es un objeto que contiene {token: ..., isAuthenticated: ..., loading: ..., user: {...}}
PriRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

//Con este mapStateToProps lo que estaremos haciendo es pasar todo el state como input de la arrow function.
//Esta arrow function tendrá un return que será un objeto. Ese objeto tendrá la propiedad auth, que será el auth state
//del Store.
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PriRoute);

//React router dom v5 component:
// import React from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { Navigate, Route } from "react-router-dom";

// const PrivateRoute = ({
//   element: Element,
//   auth: { isAuthenticated, loading },
//   ...rest
// }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       !isAuthenticated && !loading ? (
//         <Navigate replace to="/login" />
//       ) : (
//         <Element {...props} />
//       )
//     }
//   />
// );

// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default connect(mapStateToProps)(PrivateRoute);
