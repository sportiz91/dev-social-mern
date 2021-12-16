//Vamos a crear un Alert component.
//rafcp es el shortcut para traer la estructura de un React Component que tenga proptypes.
//Este componente de React también deberemos conectarlo a Redux.
//Cada vez que queramos que un componente nuestro interactúe con Redux, ya sea que llame a una acción, o que tome estado,
//Debemos conectarlo a través de la función connect del react-redux package.

//En este componente particular, no querremos llamar a una acción, sino que queremos obtener el alert state.
//Es decir, lo que vimos anteriormente en el react-redux-devtools, el array de alerts, lo quiero traer a este componente.

//Una vez que tengo las alerts como props, quiero mapear sobre dicho array y mostrar en la UI los diferentes mensajes con su diferente styling.

//Pero además, quiero asegurarme que haya algo en el state. Es decir que el array no sea null de cuando lo obtengo.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// console.log(`Alert component render`);

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    return (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    );
  });

//alerts será ahora una prop, entonces la tenemos que agregar a este objeto.
//En este caso, el shortcut es "pta", dado que es un array.
//Entiendo que con Alert.propTypes, pido que las props del componente sean de un type en particular.
Alert.propTypes = { alerts: PropTypes.array.isRequired };

//Esta variable toma el nombre de EXACTAMENTE lo que queremos hacer:
//Mapear el state del Redux Alert a props de este componente.
//Se pasa como input de la arrow function el state y luego devolvemos un objeto con prop el state.
//Podemos hacer state. y lo que queramos del root reducer. En este caso, en el root reducer, el único state que tenemos codeado
//Al momento es alert. Pero podría ser alert.profiles, por ejemplo, si también hubiera un profiles state.
//Entonces ahora tenemos props.alerts, disponible para nosotros. Sin embargo, nosotros estamos desestructurando arriba el objeto alerts.
//Entonces, en la variable alerts, tengo el state de las alerts.
const mapStateToProps = (state) => ({ alerts: state.alert });

//Recordemos que connect function lleva dos argumentos:
//1. mapStateToProps (para darle el estado desde Redux al componente)
//2. actions que se quieran utilizar en este component para poder actualizar el state en Redux.
export default connect(mapStateToProps)(Alert);
