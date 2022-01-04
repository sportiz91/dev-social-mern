import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <div className="developer bg mb-1">
      <div className="developer-img">
        <img className="img-round" src={avatar} alt="developer-img" />
      </div>

      <div className="developer-info">
        <h4 className="lead">{name}</h4>
        <p>
          {status} {company && <span> at {company} </span>}
        </p>
        <p>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary my-1">
          {" "}
          View profile{" "}
        </Link>
      </div>

      <ul>
        {skills.slice(0, 4).map((skill, index) => {
          return (
            <li key={index} className="developer-skills">
              <p class="text-primary">
                <i class="fas fa-check text-primary"> </i>
                {"  " + skill}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
