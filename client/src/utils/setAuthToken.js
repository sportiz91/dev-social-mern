//Será una función que toma un token. Si existe el token
//lo agregará al header de la request y sino, lo deletea del header:
//Con axios no vamos a hacer ninguna request. Simplemente vamos a estar agregando el token al global header.
import axios from "axios";

const setAuthToken = (token) => {
  //El token proviene de localStorage.
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
