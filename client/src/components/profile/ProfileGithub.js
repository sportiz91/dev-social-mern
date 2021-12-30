/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getGithubRepos } from "../../actions/profile";

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]);

  return (
    <div class="profile-github">
      <h2 class="text-primary my-1">
        <i class="fab fa-github text-primary"></i>
        {"  "}Github Repos
      </h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map((repo) => {
          return (
            <div key={repo._id} className="repo bg-white my-1 p-1">
              <div className="repo-text">
                <h4 className="text-primary">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                </h4>
                <p>
                  {repo.description
                    ? repo.description
                    : "No description found..."}
                </p>
              </div>

              <div class="repo-engagement">
                <div class="badge badge-primary">
                  <p>Stars: {repo.stargazers_count}</p>
                </div>
                <div class="badge">
                  <p>Watchers: {repo.watchers_count}</p>
                </div>
                <div class="badge badge-light">
                  <p>Forks: {repo.forks_count}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
