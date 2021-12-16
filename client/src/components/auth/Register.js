//Dado que estamos en un form, deberíamos tener state. Cada input debería tener su estado propio y también su relativa onChange function.
//Importante: cada vez que cambia el estado del functional component, se produce un re-render del componente.
//Esto hace que se actualicen las variables name, email, password y password2.
//Por lo tanto, dado que en los inputs tengo como atributo value las variables definidas, los inputs contendrán esos valores.
//Para ver que cada vez que cambia el estado del functional component se produce un re-render, ver el console.log primero -> "re-render".

//En última instancia vamos a querer una redux action para hacer la request al Back-End, pero por el momento, dado que no tenemos implementado Redux,
//Lo haremos con React simplemente. Para eso, vamos a usar axios para hacer requests al Servidor.

//Redux:
//Para conectar el componente de React a Redux, lo puedo hacer a través de Connect. Connect es parte del redux-react package.
//Además, querremos traer esa alerta a nuestro componente. Cuando importamos una action, lo que queremos hacer es pasarla como
//Argumento del connect.

import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types"; //impt -> shortcut para importar proptypes.
import Alert from "../layout/Alert";
import axios from "axios";

// console.log(`Register component render`);

//Como estamos pasando como argumento del componente las props de la action que se trajo al componente, puedo usarla como prop.
//prop.setAlert en este caso.
const Register = ({ setAlert }) => {
  // console.log("re-render"); -> desactivar para ver la cantidad de re-renders del functional component.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  //...formData lo que hace es copiar el formData object cambiando solo las propiedades que definamos.
  //El problema con esto es que siempre estará cambiando la propiedad name del objeto formData.
  //Ahora bien, yo quiero usar la función onChange en todos los inputs.
  //onChange = (e) => setFormData({ ...formData, name: e.target.value });

  //Importante destacar, el [e.target.name] lo tenemos que desestructurar como array. Si nos fijamos
  //El console.log del e.target, veremos que nos da [object HTMLInputElement], es decir,
  //Un array que adentro tiene un objeto HTMLInputElement, donde las propiedades vendrían a ser los atributos
  //Determinados en el HTML Input Element.
  const onChange = (e) => {
    // console.log(`e: ${e}`);
    // console.log(`e.target: ${e.target}`);
    // console.log(typeof e.target);
    // console.log(`e.target.name: ${e.target.name}`);
    // console.log(`e.target.value: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      //En vez de hacer un console.log con la alerta, puedo conectar el componente a redux para llamar a la acción SET_ALERT.
      //console.log("Password do not match");

      //Esto lo que hará es pasarle el string al action (msg). Recordemos: setAlert(msg, alertType)
      //El alertType será danger. Recordemos que en el CSS, tenemos las clases alert-danger, alert-primary, etc.
      //Entonces, quiero que esa clase de CSS vaya cambiando dinámicamente.
      setAlert("Password do not match", "danger");
    } else {
      console.log(`SUCCESS! ${formData}`);

      //Todo este código es de ejemplo para mostrar como sería el API Hit desde el React Functional Component.
      //No obstante, luego no nos quedaremos esto, dado que queremos que toda esta acción se haga desde el redux.
      //   const newUser = {
      //     name,
      //     email,
      //     password,
      //   };

      //   //newUser object debería tener name: redacted, email: redacted, password: redacted
      //   console.log(newUser);

      //   //En este caso, vamos a estar enviando data al Servidor, para hacer la request. Entonces, necesitamos un config object.
      //   try {
      //     const config = {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     };

      //     const body = JSON.stringify(newUser);

      //     //Axios siempre retorna una promesa.
      //     //En este caso, vamos a estar hiteando el api/users route (post).
      //     //Este POST Request nos debería tirar un token en caso que pase las validaciones de client y server side.
      //     //Además, deberíamos poder hacer la post request a "api/users" dado que agregamos el proxy.
      //     const res = await axios.post("api/users", body, config);
      //     console.log(res);
      //     console.log(res.data); //res.data debería ser el token. Ese token lo usamos para acceder a protected routes.
      //   } catch (err) {
      //     console.error(err.response.data);
      //   }
    }
  };

  return (
    <section className="container">
      <Alert />
      <h1 className="text-l text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <small className="form-text">
          This site uses Gravatar, so if you want a profile image, use a
          Gravatar email
        </small>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password2"
            value={password2}
            placeholder="Confirm Password"
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input
          className="btn btn-primary my-1"
          type="submit"
          value="Register"
        />
        <p>
          Already have an account?
          <Link to="/login" className="text-primary">
            &nbsp;Sign In
          </Link>
        </p>
      </form>
    </section>
  );
};

//setAlert será una propType.
//En este caso setAlert es una function. Entonces quiero como shortcut ptf (de proptype function)
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

//connect me sirve para conectar mi componente de React a Redux. Toma dos argumentos:
//1. Cualquier estado que queremos mapear. Si queremos obtener state de alertas, profiles, etc. Eso va como primer parámetro.
//En este caso irá null, dado que no queremos ningún state por el momento.
//2. Cualquier action que queramos usar, en la forma de un objeto. Esto nos permitirá usar props.setAlert.
export default connect(null, { setAlert })(Register);
