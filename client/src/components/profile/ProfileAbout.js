import React from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => {
  return (
    <div className="profile-bio bg my-1 p-2">
      {bio && (
        <>
          <h2 className="text-primary">{name.trim().split(" ")[0]}'s Bio</h2>
          <p className="line">{bio}</p>
        </>
      )}

      <h2 className="text-primary">Skill Set</h2>
      <ul>
        {skills.map((skill, index) => {
          return (
            <li key={index}>
              <i className="fas fa-check text-primary"></i>
              {"  " + skill}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
