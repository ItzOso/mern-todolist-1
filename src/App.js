import { useState, useEffect } from "react";

const API_BASE = "https://mern-todolist-1.herokuapp.com";

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const [isEditing, setIsEditing] = useState([false, ""]);
    const [edit, setEdit] = useState("");

    useEffect(() => {
        GetTodos();

        console.log(todos);
    }, []);

    const GetTodos = () => {
        fetch(`${API_BASE}/todo`)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => console.error("Error: ", err));
    };

    const CompleteTodo = async (id) => {
        const data = await fetch(`${API_BASE}/todo/complete/${id}`).then((res) => res.json());

        setTodos((todos) =>
            todos.map((todo) => {
                if (todo._id === data._id) {
                    todo.complete = data.complete;
                }

                return todo;
            })
        );
    };

    const DeleteTodo = async (id) => {
        const data = await fetch(`${API_BASE}/todo/delete/${id}`, {
            method: "DELETE",
        }).then((res) => res.json());

        setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
    };

    const EditTodo = async (id) => {
        const data = await fetch(`${API_BASE}/todo/edit/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: edit,
            }),
        }).then((res) => res.json());

        console.log(data);
        console.log(todos);

        const updatedTodos = todos.map((todo) => {
            if (todo._id === data._id) {
                todo.text = edit;
            }
            return todo;
        });

        setTodos(updatedTodos);

        setIsEditing([false, ""]);
        setEdit("");
    };

    const AddTodo = async () => {
        const data = await fetch(`${API_BASE}/todo/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: newTodo,
            }),
        }).then((res) => res.json());

        console.log(data);

        setTodos([...todos, data]);
        setPopupActive(false);
        setNewTodo("");
    };

    return (
        <div className="App">
            <h1>Welcome, Oscar</h1>
            <h4>Your tasks</h4>

            <div className="todos">
                {todos.map((todo) => (
                    <div className={"todo " + (todo.complete ? "is-complete" : "")} key={todo._id}>
                        <div className="checkbox" onClick={() => CompleteTodo(todo._id)}></div>

                        <div className="text">{todo.text}</div>

                        <div className="edit-todo" onClick={() => {setIsEditing([true, todo._id]); setEdit(todo.text)}} >
                            edit
                        </div>

                        <div className="delete-todo" onClick={() => DeleteTodo(todo._id)}>
                            x
                        </div>
                    </div>
                ))}
            </div>
            <div className="addPopup" onClick={() => setPopupActive(true)}>
                +
            </div>

            {isEditing[0] ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setIsEditing([false, ""])}>
                        x
                    </div>

                    <div>
                        <h3>Edit Task</h3>
                        <input
                            type="text"
                            className="todo-input"
                            value={edit}
                            onChange={(e) => setEdit(e.target.value)}
                            autoFocus
                        />
                        <div className="button" onClick={() => EditTodo(isEditing[1])}>
                            Edit
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>
                        x
                    </div>

                    <div className="content">
                        <h3>Add Task</h3>
                        <input
                            type="text"
                            className="todo-input"
                            onChange={(e) => setNewTodo(e.target.value)}
                            value={newTodo}
                            autoFocus
                        />
                        <div className="button" onClick={AddTodo}>
                            Create
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
