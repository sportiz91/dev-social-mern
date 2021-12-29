//Importando los types:
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "../actions/types";

//Creando el initial state:
const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };

    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };

    //Lo que hacemos acá es agregar al array de posts, el nuevo post creado.
    //Entonces, querremos hacer el estado del array anterior, y el nuevo post.
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => {
          return post._id !== payload;
        }),
        loading: false,
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    //Recordemos que cada post es un objeto que tiene diferentes propiedades y métodos.
    //Ej: _id, user, text, name, avatar, likes, comments, etc.
    //Por otra parte, la request `/api/posts/like/${postId}` lo que hace es retornar el array de likes (post.likes).
    //Por ende, cuando se dispatchea la action UPDATE_LIKES, tengo que retornar un objeto que me tome el state inicial
    //Y dentro de posts tengo que iterar sobre el array de posts y agarrarme el post donde el id del payload coincida con el id
    //del post que toca en la pasada de la iteración. Si coinciden los ids, tengo que dejar el objeto post tal cual está (...post)
    //A excepción del likes array, que le tengo que cargar el payload.likes.
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) => {
          return post._id === payload.id
            ? { ...post, likes: payload.likes }
            : post;
        }),
        loading: false,
      };

    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };

    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter((comment) => {
            return comment._id !== payload;
          }),
        },
        loading: false,
      };

    default:
      return state;
  }
}
