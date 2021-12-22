//Este es nuestro main dashboard file. Pero también va a haber otros componentes más pequeños dentro de Dashboard.
//Básicamente acá es donde vamos a fetchear toda la data usando actions. Y luego vamos a traer esa data desde el Redux state.
//Además, vamos a pasar esta data fetcheada a otros componentes, por ejemplo educations & experience components.
//Para importar un react arrow functional component con proptypes, las siglas son: rafcp
//Hasta este momento, supongamos que me logueo con usuario y contraseña válidos. Accedo a la página dashboard. Si luego
//cierro sesión, y voy para atrás, volveré a la página de dashboard. Y la podré ver. No quiero que la podamos ver.
//Para eso, vamos a crear un private route component. El componente será PrivateRoute.js!

import React from "react";
import PropTypes from "prop-types";

const Dashboard = (props) => {
  return <div className="container">Dashboard</div>;
};

Dashboard.propTypes = {};

export default Dashboard;
