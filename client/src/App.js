//<> -> es un fragment (es básicamente un ghost div).
//También se puede usar como fragment -> <Fragment> <h1> hello world! </h1> </Fragment>.
//En ese caso, deberemos importar el Fragment:
//import React, { Fragment } from "react";
//Esto se debe a que evidentemente react es un objeto, que tiene el método react.Fragment. En ese caso, estamos desestructurando dicho método
//Del objeto react y lo importamos en este jsx.
//En el caso que use el <> </> no deberé importar Fragment.

//Router: para que funcione el router tenemos que wrappear todo en el <Router> component.
//Ojo que react-router-v6 tiene una actualización. Lo que antes era switch, ahora es Routes.

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
import "./App.css";
//Redux:
//El provider proviene del react-redux package. Esto es lo que conecta React con Redux.
//Esto se debe a que Redux está separado de React.
import { Provider } from "react-redux";
//Store:
import store from "./store";

//Para usar el Provider determinado, tenemos que wrappear toda la estructura del functional component App en el Provider.
//De esta forma, todos los componentes que creemos luego, podrán acceder al State nube.
//Al component Provider le tenemos que pasar la store como prop.

import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

//En este caso, dado que tenemos acceso directo al store, puedo utilizar el método store.dispatch del objeto store.
//En los casos donde no tengo acceso al store, tengo que conectar mi componente al Store a través de connect
//Y utilizar el dispatch como prop del component.
//Como segundo parámetro agregamos [] para decir que solo se cargue cuando se monta el componente (no cuando se re-render)
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
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
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
