//<> -> es un fragment (es básicamente un ghost div).
//También se puede usar como fragment -> <Fragment> <h1> hello world! </h1> </Fragment>.
//En ese caso, deberemos importar el Fragment:
//import React, { Fragment } from "react";
//Esto se debe a que evidentemente react es un objeto, que tiene el método react.Fragment. En ese caso, estamos desestructurando dicho método
//Del objeto react y lo importamos en este jsx.
//En el caso que use el <> </> no deberé importar Fragment.

import React from "react";
import { Navbar } from "./components/layout/Navbar";
import "./App.css";

const App = () => (
  <>
    <Navbar />
  </>
);

export default App;
