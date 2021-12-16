import React from "react";
import { Link } from "react-router-dom";

export const Landing = () => {
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
