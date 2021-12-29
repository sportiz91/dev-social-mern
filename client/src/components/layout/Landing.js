import React from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//When user is loggedin, do not show landing. Everytime landing link get's pressed, redirect to dashboard.
const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div>
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="text-xl">Developer Connector</h1>
            <p className="lead">
              Create developer profile/portfolio, share posts and get help from
              other developers
            </p>
            <div className="stack-small">
              <Link className="btn btn-primary" to="/register">
                Sign Up
              </Link>
              <Link className="btn" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
