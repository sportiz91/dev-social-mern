//Parent post component
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { getPost } from "../../actions/post";

const Post = ({ getPost, post: { post, loading } }) => {
  const { id } = useParams();

  useEffect(() => {
    getPost(id);
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className="container">
      <Alert />
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>

      <div className="posts">
        <PostItem post={post} showActions={false} />
      </div>

      <CommentForm postId={id} />
      <div className="posts">
        {post.comments.map((comment) => {
          return (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={post._id}
            />
          );
        })}
      </div>
    </section>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

export const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
