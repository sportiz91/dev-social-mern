import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState(""); //Un post solo contiene un texto. Es por eso que solo debo completarle un string.

  //onSubmit pasamos el formData como un objeto, dado que será el objeto que irá como segundo parámetro de la axios request.
  return (
    <>
      <div className="alert alert-primary">
        <h3>Say Something...</h3>
      </div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText("");
        }}
      >
        <textarea
          cols="30"
          rows="5"
          placeholder="Create a post"
          className="form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <input type="submit" className="btn btn-dark" />
      </form>
    </>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
