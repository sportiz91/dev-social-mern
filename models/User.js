//Para interactuar con nuestra DB, debemos crear un Modelo para cada uno de nuestros recursos.
//Para eso creamos la carpeta Models y dentro un User.js
//Para crear un Modelo debemos crear un Schema. Esto contendrá los campos que quiero que el recurso particular tenga.
//En este script particular querremos tener la capacidad de registrar nuevos Usuarios.
//El modelo o Schema contendrá los campos necesarios para registrar al nuevo Usuario.

const mongoose = require("mongoose");

//El mongoose.Schema contendrá un objeto con los campos que quiero que contenga este modelo (Schema).
//unique: true implica que no querremos dos usuarios diferentes que se registren con el mismo mail.
//Gravatar te permite vincular una Profile Picture a tu email.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creamos una variable llamada User que contenga el modelo, donde el primer argumento es siempre el user en minúscula y el segundo argumento sería el Schema creado.
module.exports = User = mongoose.model("user", UserSchema);
