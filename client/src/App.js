//<> -> es un fragment (es básicamente un ghost div).
//También se puede usar como fragment -> <Fragment> <h1> hello world! </h1> </Fragment>.
//En ese caso, deberemos importar el Fragment:
//import React, { Fragment } from "react";
//Esto se debe a que evidentemente react es un objeto, que tiene el método react.Fragment. En ese caso, estamos desestructurando dicho método
//Del objeto react y lo importamos en este jsx.
//En el caso que use el <> </> no deberé importar Fragment.

//Router: para que funcione el router tenemos que wrappear todo en el <Router> component.
//Ojo que react-router-v6 tiene una actualización. Lo que antes era switch, ahora es Routes.

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import Register from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import Alert from "./components/layout/Alert";
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

//Redux:
//El componente Alert irá encima de Routes. Routes (ex Switch) solo puede tener Route en su interior, entonces
//Va arriba.

const App = () => (
  <Provider store={store}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </>
    </Router>
  </Provider>
);

export default App;
