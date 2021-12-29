import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState(""); //A post only contains a string. That's why local state is only a string

  //onSubmit passes the text state string argument as object, because is a parameter of formData to the axios request.
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
