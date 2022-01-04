import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  DELETE_ACCOUNT,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
} from "./types";

//Get current users profile
//getCurrentProfile gets called as soon as we are redirected the dashboard component.
export const getCurrentProfile = () => async (dispatch) => {
  try {
    //Requisites: token.
    const res = await axios.get("/api/profile/me"); //returns logged in user profile. No need of id. JWT have user id encrypted.

    dispatch({
      type: GET_PROFILE,
      payload: res.data, //user profile data.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }, //err.response.statusText = "bad request", //err.response.status = 400.
    });
  }
};

//Get all profiles:
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE }); //firstly, we clear_profile. That's because when we are visiting another person's profile, we need to clear what is in profile
  //state first.

  try {
    //Requisites: none
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data, //array of objects with every profile (with the user name and avatar populated from the User model)
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get profile by id:
export const getProfileById = (userId) => async (dispatch) => {
  try {
    //Requisites: none
    const res = await axios.get(`/api/profile/user/${userId}`); //returns profile (profile fields + user model name + avatar)

    dispatch({
      type: GET_PROFILE,
      payload: res.data, //profile
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get GitHub Repos:
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`); //res.data -> array with last 5 repos (objects)

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create or update profile:
//Edit = false = creating new profile
//Edit = true = updating existing profile.
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      //Requisites: token + header with content-type: application/json
      const res = await axios.post("/api/profile", formData, config); //returns the profile updated or created.

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      //Dispatch a success alert "profile updated" or "profile created"
      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      //If i'm creating a new profile, redirect to dashboard after success.
      //If I'm editing an existing profile, then, edit profile page persists.
      //If i'm redirecting in an action, I can't use <Navigate /> component.
      //I have to use the useNavigate hook in this case.
      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      //We want validation errors in an alert
      const errors = err.response.data.errors;

      // console.log(errors);

      //If errors array is truly, then show alerts. One for each error.
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

//Add Experience Action:
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Requisites: token + application/json + validations (backend)
    const res = await axios.put("/api/profile/experience", formData, config); //returns the updated profile with new experience added to the array of experiences.

    dispatch({
      type: "UPDATE_PROFILE",
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    navigate("/dashboard"); //Once finished updating, navigate to dashboard.
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(err.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Education Action:
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    navigate("/dashboard");

    dispatch(setAlert("Education Added", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(err.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Experience:
export const deleteExperience = (id) => async (dispatch) => {
  try {
    //Requisites: token + id of experience in url.
    const res = await axios.delete(`/api/profile/experience/${id}`); //returns the "updated" profile (the array of experiences will not have previous exp)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Education:
export const deleteEducation = (id) => async (dispatch) => {
  try {
    //Requisites: token + id of education in url.
    const res = await axios.delete(`/api/profile/education/${id}`); //returns the "updated" profile (the array of education will not have previous edu)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Account & Profile:
export const deleteAccount = (id) => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone")) {
    try {
      //Requisites: token
      await axios.delete("/api/profile"); //returns {msg: "User deleted"}

      //Clears profile (individual) from profile state.
      dispatch({
        type: CLEAR_PROFILE,
      });

      //Removing token from localStorage and resetting the auth parameters.
      dispatch({
        type: DELETE_ACCOUNT,
      });

      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
