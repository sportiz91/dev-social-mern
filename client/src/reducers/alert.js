//La función a exportar tomará como valor default el initialState y una acción.
//Cada action tendrá dos argumentos. Uno obligatorio que será el Type. Luego tendrá también
//Un payload que será la data. A veces no tendremos data dentro de la action. Es decir
//A veces podremos llamar un action type, pero sin data.
//El type es lo que necesitaremos evaluate.
//El action es un objeto entonces tendrá, como se dijo anteriormente, el type (obligatorio) y el payload -> data (opcional).
//El type se irá evaluando por cases (del switch).
//La convención común es tomar variables para los types. Esas variables están definidas en la carpeta actions.
//Importamos las variables que están definidas en src/actions/types.js:
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

//El alert reducer será simplemente una función que toma simplemente una pieza de state (cualquier State que tenga que ver con alerts)
//y una acción. La acción será dispatch from un action file.

//Las alertas serán objetos en este Array
const initialState = [];

//Dependiendo del tipo de acción, deberemos decidir que state enviar para abajo a lo largo de nuestra App.
//Por ende, en cada case del switch deberemos retornar algo.
//Importante destacar: el ...state se utiliza para copiar todo el estado que tenemos anteriormente en nuestra App.
//En el action.payload irá la nueva alerta que se quiera setear, en este caso.
//Para el REMOVE_ALERT lo que querremos hacer es rmeover determinada alerta por su id.
//El payload, en este caso, será solo el ID. Es por eso que para el REMOVE_ALERT case simplemente queremos filtrar
//Del array de alerts, la que tenga un id igual al payload.
//Cada reducer que creemos tendrá un default case que retornará el state como esta en ese momento.
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];

    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
}

//Adentro de la carpeta actions irá un file con el mismo nombre que el reducer, alert.js
