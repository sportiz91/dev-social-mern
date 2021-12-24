import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation }) => {
  const navigate = useNavigate();

  //Si current es true, quiero tener el campo to del objeto disableado. Si chequemaos la current box implica que todavía trabajamos ahí.
  const [formData, setFormData] = useState({
    school: "", //ok
    degree: "", //ok
    fieldofstudy: "", //ok
    from: "", //ok
    to: "", //ok
    current: false, //ok
    description: "", //ok
  });

  const [toDateDisabled, setToDateDisabled] = useState(false);

  //Desestructuramos el objeto para tener las propiedades del mismo en variables.
  const { school, degree, fieldofstudy, from, to, current, description } =
    formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="container">
      <h1 className="text-l text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i>
        Add any school or bootcamp that you have attended
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addEducation(formData, navigate);
        }}
      >
        <small className="form-text"> * = required fields </small>

        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            value={degree}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldofstudy"
            value={fieldofstudy}
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
          Current
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
          placeholder="Program Description"
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
