import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  return (
    <div className="post bg-white my-1 p-1">
      <div className="post-img">
        <img className="img-round" src={avatar} alt="doe-img" />
        <h4 className="text-primary my-1">{name}</h4>
      </div>
      <div className="post-description">
        <p>{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>

        <div className="post-description-buttons">
          <button className="btn" onClick={(e) => addLike(_id)}>
            <i className="fas fa-thumbs-up"></i>
            {"  "} {likes.length > 0 && <span>{likes.length}</span>}
          </button>
          <button className="btn" onClick={(e) => removeLike(_id)}>
            <i className="fas fa-thumbs-down"></i>
          </button>
          <Link to={`/post/${_id}`} className="btn btn-primary">
            Discussion{" "}
            {comments.length > 0 && (
              <span className="comment-count">{comments.length}</span>
            )}
          </Link>

          {!auth.loading && user === auth.user._id && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => deletePost(_id)}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
