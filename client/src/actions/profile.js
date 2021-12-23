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

//Crear o actualizar un perfil:
//al createProfile action le pasaremos un argumento que es el formData. A raiz de eso le estaremos pegando al reducer que cree o actualice el perfil.
//Otra cosa que queremos hacer es redireccionar una vez que submitimos el form. Vamos a pasar como segundo parámetro el history object que tiene un método
//llamado push -> que nos redireccionará a un Client Side Route.
//Además, para saber si estamos actualizando o creando un perfil desde 0, vamos a tener un tercer parámetro: edit, que se setea a false by default (es decir,
//por default estaremos creando un nuevo perfil). Se puede crear una función completamente separada para editar o actualizar el perfil, pero es muy parecida,
//entonces conviene tener un tercer parámetro y listo.
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/profile", formData, config);

      //Una vez que creemos/actualicemos el nuevo perfil, lo único que haremos en términos de retornar valores en obtener el nuevo
      //perfil creado. Con lo cual, tenemos que enviar un dispatch de GET_PROFILE.
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      //También quiero setear una alerta que me diga que el perfil fue actualizado o que el perfil fue creado.

      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      //Si estoy editando el perfil, no voy a redireccionar a otra página, voy a quedarme en la misma.
      //Si estoy creando un nuevo perfil, voy a redireccionar a otra página.

      //Las redirecciones en las actions son diferentes. No podemos redireccionar como en los React Components,
      //Donde usábamos <Navigate />. Para hacer las redirecciones dentro de las actions types, tenemos que pasar
      //El History Object que tiene el push method.
      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      // console.log("we are here");

      //Vamos a querer los validation errors en una alerta:
      const errors = err.response.data.errors;

      // console.log(errors);

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      //Para el error de la creación o actualización del perfil, simplemente vamos a dispatchear el PROFILE_ERROR error:
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
