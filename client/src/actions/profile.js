import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

//Get current users profile:
//Para este caso puntual, queremos hitear a la API /api/profile/me. Esta API me da el perfil de la persona logueada.
//Es lógico que esta API sea privada, puesto que requiere authenticación y el JWT para ser devuelta.
//Querremos llamar la getCurrentProfile action tan pronto como nos redirecciones a la route dashboard.
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me"); //en este caso no tenemos que pasar un id ni nada por el estilo
    //el request sabrá que perfil traer por el token, que incluye el id cuando se desencripta.

    console.log("here");

    dispatch({
      type: GET_PROFILE,
      payload: res.data, //recordemos que ese api HIT nos devuelve toda la profile data, la cual queremos almacenar como payload.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
