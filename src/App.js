import { gql, useQuery, Mutation, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState, setState } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";


const LOCAL_STORAGE_KEY = "todo-list-todos";




function App() {

  const client = new ApolloClient({
    uri: "http://127.0.0.1:5000/graphql",
    cache: new InMemoryCache(),
  });
  
  
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    // fires when app component mounts to the DOM
    const storageTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storageTodos) {
      setTodos(storageTodos);
    }
  }, []);

  useEffect(() => {
    // fires when todos array gets updated
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(todo) {
    // adds new todo to beginning of todos array
    setTodos([todo, ...todos]);
  }


  function toggleComplete(id) {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleSave(newTodo){
    // Call Apollo with todo Id and new values
      setTodos(
        todos.map(todo => {
          if (todo.id === newTodo.id) {
            return {
              ...newTodo,
              task: newTodo.task
            };
          }
          return todo;
        })
      );
  }

  return (
    <ApolloProvider client = {client}>
      <div className="App">
        <Typography style={{ padding: 16 }} variant="h1">
          Todo
        </Typography>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={todos}
          removeTodo={removeTodo}
          toggleComplete={toggleComplete}
          handleSave={handleSave}
          />
      </div>
    </ApolloProvider>
  );
}

export default App;
