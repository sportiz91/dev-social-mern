//This component gets alert state from redux.
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// console.log(`Alert component render`); -> check how many renders alert component does.

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    return (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    );
  });

Alert.propTypes = { alerts: PropTypes.array.isRequired };

const mapStateToProps = (state) => ({ alerts: state.alert });

export default connect(mapStateToProps)(Alert);
