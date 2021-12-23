//Vamos a tener acciones para: obtener el perfil, crear profile, actualizar profile, etc.

import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";

//Cuando nos loguemos a la página, se va a hacer una GET Request para obtener toda nuestra profile data.
//Esa profile data irá en la propiedad profile del state. Además, siempre que visitemos el perfil de otro developer,
//También se hará un request donde se pondrá la data de ese otro perfil en la propiedad profile. Básicamente profile
//Tendrá todo perfil individual data.
//En profiles tendremos un array con todos los developers listados en la página.
//repos será un array con los github repos fetcheados.
//Al igual que antes, loading es true por default y cuando hacemos un request se pone como falso.
//Luego tendremos la propiedad errors, que será un objeto que almacene todos los errores derivados de las requests.
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  errors: {},
};

//Primer action -> Get Profile.
export default function (state = initialState, action) {
  const { type, payload } = action; //desestructuramos el action object.

  switch (type) {
    //Para GET_PROFILE, cuando la request esté finalizada completamente, queremos poner la propiedad loading en false.
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };

    default:
      return state;
  }
}
