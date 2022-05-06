import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";

const HOST_API = "http://localhost:8080/api";
const initialState = { list: [], item: {} };
const Store = createContext(initialState);

/**
 * Es un formulario que le permite agregar o editar un elemento de tareas pendientes.
 * @returns componente Form el cual muestra un  input de texto donde modificar
 * o crear nuevo TODO y un botón el cual indica si se va a Agregar o a Actualizar.
 */
const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false,
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted,
    };

    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef} onSubmit={!item.id ? onAdd : onEdit}>
      <div class="input-group mb-3">
        <input
          type="text"
          name="name"
          required
          defaultValue={item.name}
          placeholder="¿Que tienes pendiente?"
          className="form-control"
          onChange={(event) => {
            setState({ ...state, name: event.target.value });
          }}
        />
        <input
          type="submit"
          value={!item.id ? "Agregar" : "Actualizar"}
          className="btn btn-outline-success"
        />
      </div>
    </form>
  );
};

/**
 * Obtiene la lista de TODO's de la API y luego muestra una tabla con la lista de TODO's
 * @returns Componente List el cual muestra una tabla con la lista de TODO's
 */
const List = () => {
  const { dispatch, state } = useContext(Store);

  /* Hook que permite la actualización del estado de lista con los TODO's traidos desde la API */
  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then((resp) => resp.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);

  /**
   * Toma un id como argumento, luego realiza una solicitud DELETE a la API y luego envía
   * una acción al reducer.
   * @param id - El id del elemento que se va a eliminar.
   */
  const onDelete = (id) => {
    fetch(HOST_API + "/todo/" + id, {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  /**
   * Cuando el usuario haga clic en el botón de edición, envía una acción al Store.dispatch para editar el
   * artículo.
   * @param todo - el elemento pendiente en el que se hizo clic
   */
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  /**
   * Cuando el usuario haga clic en el checkbox y cambie su valor
   * toma un evento y un elemento de tarea pendiente como parámetros, y luego envía una solicitud al
   * servidor para actualizar el estado completado del elemento de tarea pendiente.
   * @param event - El evento que desencadenó la función.
   * @param todo - El elemento de tarea pendiente en el que se hizo clic
   */
  const onCompleted = (event, todo) => {
    const request = {
      completed: event.target.checked,
    };
    fetch(HOST_API + "/todo/" + todo.id + "/completed", {
      method: "PATCH",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
      });
  };

  return (
    <div className="mt-5">
      <table className="table table-striped">
        <thead className="bg-primary text-white">
          <tr className="text-center">
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">¿Completado?</th>
            <th scope="col" colspan="2" className="border">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id} className="text-center">
                <th scope="row">{todo.id}</th>
                <td style={{ "word-break": "break-all" }}>{todo.name}</td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={todo.completed}
                    onChange={(event) => onCompleted(event, todo)}
                    className="checkbox"
                  ></input>
                </td>
                <td>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => onEdit(todo)}
                    className="btn btn-warning"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * La función reducer toma el estado actual y una acción, y devuelve un nuevo estado
 * @param state - Este es el estado actual de la aplicación.
 * @param action - Este es el objeto de acción que se envía desde el componente.
 * @returns El estado está siendo devuelto.
 */
function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };
    case "delete-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };
    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

/**
 * Toma un componente secundario y devuelve un nuevo componente que envuelve el componente secundario
 * en un proveedor de contexto
 * @returns StoreProvider devuelve Store.Provider con el valor del estado y el envío.
 */
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

function App() {
  return (
    <StoreProvider>
      <div className="container">
        <h1>TODO's CRUD</h1>
        <Form />
        <List />
      </div>
    </StoreProvider>
  );
}

export default App;
