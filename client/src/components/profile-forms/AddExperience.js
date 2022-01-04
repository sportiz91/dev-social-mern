import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience }) => {
  const navigate = useNavigate();

  //If current is true, then "to" field is disabled.
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDateDisabled, setToDateDisabled] = useState(false);

  //Desestructuring state object.
  const { company, title, location, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="container">
      <h1 className="text-l text-primary">Add An Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i>
        Add any developer/programming positions that you have had in the past
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addExperience(formData, navigate);
        }}
      >
        <small className="form-text"> * = required fields </small>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Company"
            name="company"
            value={company}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
          />
        </div>

        <h4 className="form-h4">From Date</h4>
        <div className="form-group special">
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="my-1">
          <input
            type="checkbox"
            name="current"
            checked={current}
            value={current}
            onChange={(e) => {
              setFormData({ ...formData, current: !current });
              setToDateDisabled(!toDateDisabled);
            }}
          />{" "}
          Current Job
        </div>

        {toDateDisabled ? null : (
          <>
            {" "}
            <h4>To Date</h4>
            <div className="form-group special">
              <input
                type="date"
                name="to"
                value={to}
                onChange={(e) => onChange(e)}
              />
            </div>
          </>
        )}

        <textarea
          cols="30"
          rows="5"
          className="form-textarea"
          placeholder="Job Description"
          name="description"
          value={description}
          onChange={(e) => onChange(e)}
        ></textarea>

        <div className="buttons my-2">
          <button className="btn btn-primary" type="submit">
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

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addExperience })(AddExperience);
