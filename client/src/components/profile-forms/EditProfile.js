import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";
import Alert from "../layout/Alert";

//En este caso también traemos la createProfile action, dado que recordemos que se usa para los dos: create profile + edit (= update) profile.
const EditProfile = ({
  createProfile,
  getCurrentProfile,
  profile: { profile, loading },
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  });

  const [displaySocialInputs, setDisplaySocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    //Con que alguno de los dos condicionales sea verdadero, vamos a dejar el campo del objeto vacío.
    //Si está cargando, implica que no terminó de procesarse la request, o bien, que hubo un error en la misma.
    //Entonces queda el campo vacío. Si no existe el campo en el state, también se tendrá que dejar vacío.
    //loading por default es false. Cuando termina de procesarse la request de forma exitosa y se hace el dispatch
    //de la acción, ahí cambia a true en el GET_PROFILE. Entonces, queremos que este useEffect se ejecute una vez
    //que loading pase de true a false, es decir, que se termine de procesar la request de pedido del perfil.
    setFormData({
      company: loading || !profile.company ? "" : profile.company,
      website: loading || !profile.website ? "" : profile.website,
      location: loading || !profile.location ? "" : profile.location,
      status: loading || !profile.status ? "" : profile.status,
      skills: loading || !profile.skills ? "" : profile.skills.join(","),
      githubusername:
        loading || !profile.githubusername ? "" : profile.githubusername,
      bio: loading || !profile.bio ? "" : profile.bio,
      twitter: loading || !profile.social ? "" : profile.social.twitter,
      facebook: loading || !profile.social ? "" : profile.social.facebook,
      linkedin: loading || !profile.social ? "" : profile.social.linkedin,
      youtube: loading || !profile.social ? "" : profile.social.youtube,
      instagram: loading || !profile.social ? "" : profile.social.instagram,
    });
  }, [loading]);

  //Vamos a desestructurar el component state para usar todo como variable:
  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, navigate, true);
  };

  return (
    <section className="container">
      <Alert />
      <h1 className="text-l text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <small className="form-text"> * = required fields </small>
        <div className="form-group">
          <select name="status" value={status} onChange={(e) => onChange(e)}>
            <option value="0">* Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor or Teacher">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <small className="form-text">
          Give us an idea of where you are at in your career
        </small>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            value={company}
            name="company"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="form-text">
          Could be your own company or one you work for
        </small>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            value={website}
            name="website"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="form-text">
          Could be your own or a company website
        </small>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            value={location}
            name="location"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="form-text">
          City & state suggested (eg. Boston, MA)
        </small>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            value={skills}
            name="skills"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="form-text">
          Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
        </small>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            value={githubusername}
            name="githubusername"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="form-text">
          If you want your latest repos and a Github link, include your username
        </small>
        <textarea
          cols="30"
          rows="3"
          placeholder="A short bio about yourself"
          className="form-textarea form-textarea-createprofile"
          value={bio}
          name="bio"
          onChange={(e) => onChange(e)}
        ></textarea>
        <small className="form-text"> Tell us a little about yourself </small>

        <div className="stack-small my-2">
          <button
            onClick={() => setDisplaySocialInputs(!displaySocialInputs)}
            className="form-span btn"
            type="button"
          >
            {" "}
            Add Social Networks Links{" "}
          </button>
          <p className="form-optional">Optional</p>
        </div>

        {displaySocialInputs && (
          <div className="form-socials">
            <div className="form-socials-twitter">
              <i className="fab fa-twitter fa-2x"></i>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={twitter}
                  name="twitter"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="form-socials-facebook">
              <i className="fab fa-facebook fa-2x"></i>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Facebook URL"
                  value={facebook}
                  name="facebook"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="form-socials-youtube">
              <i className="fab fa-youtube fa-2x"></i>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="YouTube URL"
                  value={youtube}
                  name="youtube"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="form-socials-linkedin">
              <i className="fab fa-linkedin fa-2x"></i>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Linkedin URL"
                  value={linkedin}
                  name="linkedin"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="form-socials-instagram">
              <i className="fab fa-instagram fa-2x"></i>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={instagram}
                  name="instagram"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="buttons">
          <button
            href="createprofile.html"
            className="btn btn-primary"
            type="submit"
          >
            Submit
          </button>
          <Link to="/dashboard" className="btn">
            Go Back
          </Link>
        </div>
      </form>
    </section>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  EditProfile
);
