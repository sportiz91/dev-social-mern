//This components makes some routes of the Dashboard private.
//If this component wouldn't exist. An user could, for example, log in, see the dashboard, log out, go back and see the Dashboard.
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

//PriRoute has special prop children. This prop contains child components of PriRoute.
//If user is not Authenticated and the request has been proccessed (loading === false), navigate to login because user is not authenticated.
//Contrary case, user is authenticated and we should be able to see the children component to whom PriRoute is protecting.
const PriRoute = ({ auth: { isAuthenticated, loading }, children }) => {
  return !isAuthenticated && !loading ? (
    <Navigate replace to="/login" />
  ) : (
    children
  );
};

PriRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PriRoute);
