//Function that asks if token exists. If it exists, it gets added to global header. If not, common header gets deleted.
//Token comes from localStorage (when user Log In, Register or Initial Loading of Main App).
import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"]; //deletes common header.
  }
};

export default setAuthToken;
