//Este es nuestro main dashboard file. Pero también va a haber otros componentes más pequeños dentro de Dashboard.
//Básicamente acá es donde vamos a fetchear toda la data usando actions. Y luego vamos a traer esa data desde el Redux state.
//Además, vamos a pasar esta data fetcheada a otros componentes, por ejemplo educations & experience components.
//Para importar un react arrow functional component con proptypes, las siglas son: rafcp
//Hasta este momento, supongamos que me logueo con usuario y contraseña válidos. Accedo a la página dashboard. Si luego
//cierro sesión, y voy para atrás, volveré a la página de dashboard. Y la podré ver. No quiero que la podamos ver.
//Para eso, vamos a crear un private route component. El componente será PrivateRoute.js!

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({
  auth: { user },
  profile: { profile, loading },
  getCurrentProfile,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  //Quiero asegurarme que el perfil esté cargado y no sea nulo.
  //Si el perfil es nulo, queremos mostrar un "spinner" (GIF) o "graphic".
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <div className="container">
      <h1 className="text-l text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>

      {profile !== null ? (
        <>has</>
      ) : (
        <>
          <p className="mb-1">
            You have not yet setup a Profile, please add some info
          </p>
          <Link to="/create-profile" className="btn btn-primary">
            Create Profile
          </Link>
        </>
      )}
    </div>
  );
};

//pt + type + r (required) o sin nada (no required)
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

//La mapDispatchToProps function debería devolver un plain object. Acá estamos importando la action creator
//function getCurrentProfile, por lo que la tenemos que hacer objeto para el parámetro de mapDispatchToProps.
//Dado que tenemos mapStateToProps + mapDispatchToProps, tendremos tres propiedades:
//a. auth state.
//b. profile state.
//c. getCurrentProfile action.
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
