import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";
import Alert from "../layout/Alert";

const CreateProfile = ({ createProfile }) => {
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
    createProfile(formData, navigate);
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

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(CreateProfile);
