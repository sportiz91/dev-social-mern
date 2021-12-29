//Posts.js is the parent component.
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import { getPosts } from "../../actions/post";

const Posts = ({ getPosts, post: { posts, loading } }) => {
  //As soon as component is loaded, fetch data.
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <section className="container">
      <Alert />
      <h1 class="text-l text-primary">Posts</h1>
      <p class="lead">
        <i class="fas fa-user"></i>
        {"  "} Welcome to the community
      </p>

      <PostForm />

      <div className="posts">
        {posts.map((post) => {
          return <PostItem key={post._id} post={post} />;
        })}
      </div>
    </section>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
