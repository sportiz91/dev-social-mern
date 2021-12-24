import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment"; //npm i moment react-moment
import { connect } from "react-redux";

const Education = ({ education }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </td>
      <td>
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className="my-2">Education Credentials</h2>

      <table className="table">
        <thead>
          <tr className="table-header">
            <td>School</td>
            <td className="hide-sm">Degree</td>
            <td className="hide-sm">Years</td>
            <td></td>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
};

export default Education;
