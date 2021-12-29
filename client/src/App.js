import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import PriRoute from "./components/routing/PriRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import "./App.css";

import { Provider } from "react-redux";

import store from "./store";

import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";

//if token exists in localStorage, then we need to save it in the common headers of all requests.
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

//Everything needs to be wrapped in <Provider store={store} /> component for Redux to work in our whole App.
//Everything needs to be wrapped in <Router> component for react-router-dom to work.
//Beware of react-router-dom v6! Changes several old components.
//In this case, I have direct access to store.dispatch method. In cases in which I have no access to store, I will
//need to connect the component to Redux. (connect method)
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser()); //user needs to be loaded when loading main app.
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profiles" element={<Profiles />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route
            exact
            path="/dashboard"
            element={
              <PriRoute>
                <Dashboard />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/create-profile"
            element={
              <PriRoute>
                <CreateProfile />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/edit-profile"
            element={
              <PriRoute>
                <EditProfile />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/add-experience"
            element={
              <PriRoute>
                <AddExperience />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/add-education"
            element={
              <PriRoute>
                <AddEducation />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/posts"
            element={
              <PriRoute>
                <Posts />
              </PriRoute>
            }
          />
          <Route
            exact
            path="/posts/:id"
            element={
              <PriRoute>
                <Post />
              </PriRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
