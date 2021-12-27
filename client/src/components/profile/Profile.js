//Profile.js será el parent component para todo el resto.
//Aquí traeremos el state, que luego, como una catarata, lo dispararemos hacia los componentes hijos.
//Acá vamos a llamar a la getProfileById action. Vamos a obtener la ID de la Route (URL)
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import { getProfileById } from "../../actions/profile";
import { useParams } from "react-router-dom";
import auth from "../../reducers/auth";

//Dado que estamos codeando un useEffect cuyo segundo parámetro es el getProfileById,
//Entonces ese side effect se ejecutará as soon as se cargue el componente Profile.
const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
  const { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById]);

  return (
    <section className="container">
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to="/profiles" className="btn ">
            Back To Profiles
          </Link>

          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}

          <div className="profile">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
          </div>
        </>
      )}
    </section>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

//Queremos el auth state también. Queremos ver si el user está loggedin. Si está logueado y el perfil que está viendo matchea,
//Queremos tener un botón que le permita modificar el perfil.
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
