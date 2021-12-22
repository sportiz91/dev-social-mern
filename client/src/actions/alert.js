import { v4 as uuidv4 } from "uuid";
//Importamos los SET_ALERT y REMOVE_ALERT dado que esto es lo que vamos a dispatchear.
import { SET_ALERT, REMOVE_ALERT } from "./types";

//Querremos dispatchear más de un action type de esta función aquí.
//La segunda arrow function toma como argumento el dispatch, y lo podemos hacer por el thunk middleware que exportamos previamente.
//Para el id de la alerta, queremos un random id. Para esto vamos a instalar el paquete uuid. El uuid package nos dará una universal id on the fly.
//Además, queremos tener la posibilidad de pasar el timeout a la alerta.
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4(); //En primer lugar, generamos un random uuid.

    //En segundo lugar, llamamos al alert reducer.
    //Para eso, puedo usar la función dispatch. Dentro de dispatch irá un objeto,
    //Al cual le pasamos el type de SET_ALERT. De esta forma, el reducer que codeamos previamente
    //Evaluará el switch como SET_ALERT.
    //Además, debemos mandar un payload, que es como la data. Payload será el mensaje que se pase como argumento
    //el tipo de alerta que se pasa como argumento y el id.

    // console.log(dispatch);

    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    //Entonces, luego de 5 segundos se hará el dispatch de la action REMOVE_ALERT, para la alerta en cuestión.
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
    }, timeout);
  };

//Luego de una cierta cantidad de tiempo (setTimeout) querremos definir una acción que sea removeAlert. Esto se debe a que sino, si el usuario
//Sigue haciendo click con las passwords que no coinciden, se agregarán los danger alerts uno abajo del otro (considerando el caso del danger alert).

//A través de un alert component (UI) podremos llamar a esta acción setAlert. Luego, esta acción será dispatcheada al reducer
//y el State se pasará hacia abajo a los componentes pertinentes.

//Resumen: la UI podrá llamar a la acción setAlert, la cual hará un dispatch al reducer con el type de SET_ALERT. El reducer agregará la ALERT
//Al State. Inicialmente, este estado, es un empty array.
//Un buen ejemplo de llamar a esta acción es en el Register.js component. En el escenario donde habíamos dejado el "Password do not match" puedo
//Poner una ALERT.
