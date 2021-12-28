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
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
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

            <div className="profile-exp bg-white my-1 p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((experience) => {
                    return (
                      <ProfileExperience
                        key={experience._id}
                        experience={experience}
                      />
                    );
                  })}
                </>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div class="profile-edu bg-white my-1 p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((education) => {
                    return (
                      <ProfileEducation
                        key={education._id}
                        education={education}
                      />
                    );
                  })}
                </>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
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
