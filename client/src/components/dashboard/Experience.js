//En este componente, vamos a tener las experiencias pasadas desde el parent component Dashboard.js.
//Además, vamos a tener un deleteExperience que la vamos a traer desde nuestras Actions. Es por eso que tengo que importar
//Connect.
//Para el tbody deberemos loopear sobre todas las experiencias y obtener la data que le pasemos.
//Podemos obtener las fechas, pero esta va a estar formateado feo. Acá entra en juego moment.
import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment"; //npm i moment react-moment
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td className="hide-sm">
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
        {exp.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        )}
      </td>
      <td className="row-centered">
        <button
          className="btn btn-danger"
          onClick={() => deleteExperience(exp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className="my-2">Experience Credentials</h2>

      <table className="table">
        <thead>
          <tr className="table-header">
            <td>Company</td>
            <td className="hide-sm">Title</td>
            <td className="hide-sm">Years</td>
            <td></td>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

//Para este componente no vamos a estar haciendo ningún mapStateToProps, dado que todo state que necesitamos
//Provendrá a través de props del componente dashboard (en este caso, el state experience).
//Es decir, Dashboard component es el que tiene un mapStateToProps donde se trae toda la pieza
//profile de Redux.
export default connect(null, { deleteExperience })(Experience);
