//Vamos a necesitar useEffect. Tan pronto como cargue este componente, vamos a necesitar llamar a la getProfiles() action.
//También queremos Spinner, para cuando estén cargando los perfiles.
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  //Esto debería poner todos los perfiles en el State.
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="container">
          <h1 class="text-l text-primary">Developers</h1>
          <p class="lead">
            <i class="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>

          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found ...</h4>
            )}
          </div>
        </section>
      )}
    </>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
