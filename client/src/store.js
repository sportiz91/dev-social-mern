//Acá vamos a crear una nueva Redux Store.
//Esto es solo código boilerplate. La mayoría de los Store files que veamos van a lucir bastante parecidos. Básicamente
//Tenemos que traer una función llamada create store y tenemos que pasarle determinados argumentos a la misma.
//Vamos a tener múltiples reducers -> uno para auth, uno para profile, para altertas, etc. Pero.. Los vamos a combinar en un root reducer.
//Ese es el 4to import que hacemos.

//Imports:
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers"; //El root reducer se va a importar de un index.js, entonces lo podemos llamar solo con el nombre de la carpeta.

//Initial State:
//Este initialState estará en todos nuestros reducers.
const initialState = {};

//El único middleware que tenemos importado es thunk.
const middleware = [thunk];

//Creamos el store:
//El store toma como primer parámetro el rootReducer, como segundo parámetro el initialState y después cualquier middleware que quiera pasar a la función.
//Dado que estamos utilizando la devtools extension, podemos usar composeWithDevtools.
//composeWithDevtools toma como argumento el applyMiddleware.
//Adentro del applyMiddleware podemos utilizar el Spread Operator y el middleware para traerlo.
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// console.log(store);

export default store;

//No deberemos tocar nunca más el file del Store.
//Para usar el Store deberemos ir a nuestro app.js file y deberemos importar dos cosas:
//1. Provider -> es lo que une a React con Redux.
//2. Store.
