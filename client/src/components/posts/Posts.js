//Posts.js será el parent component. El useEffect lo vamos a necesitar para llamar a la acción getPosts que creamos.
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getPosts } from "../../actions/post";

const Posts = ({ getPosts, post: { posts, loading } }) => {
  //Ni bien carga el componente, debería fetchear los posts de la API.
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return <div></div>;
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
