import { gql, useQuery,useLazyQuery, useMutation, NetworkStatus } from '@apollo/client';
// import { createPersistedQueryLink } from "apollo-link-persisted-queries";
// import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { ApolloLink } from "apollo-link";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { onError } from "apollo-link-error";


const LOCAL_STORAGE_KEY = "todo-list-todos";

const GET_TODOS = gql`
query {
  allTasks {
  		edges {
    		node {
      		taskId, item, completed
    			}
 				}
			}
		}
`;

const DELETE_TODOS = gql`
mutation DeleteTodo($taskId: Int!) {
  deleteTask(taskId: $taskId){
    task {
      taskId, item, completed
    }
  }
}
`;


function App() {

  const [todos, setTodos] = useState([]);

  const { loading, error, data, updateQuery } = useQuery(GET_TODOS);

  const [deleteFromDB] = useMutation(DELETE_TODOS);

  function fetchTodos(data){{
    updateQuery()
    setTodos(
      data.allTasks.edges.map(edge => {
        return {
          ...todos,
          id: edge.node.taskId,
          task: edge.node.item,
          completed: edge.node.completed
        }
      }),
      );
    }
  }

console.log(data)


  // useEffect(() => {
  //   // fires when app component mounts to the DOM
  //   const storageTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  //   console.log(data)
  //   if (storageTodos) {
  //     setTodos(storageTodos);
  //   }
  //   fetchTodos()

  // }, []);

  // useEffect(() => {
  //   // fires when todos array gets updated
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  // }, [todos]);


  function addTodo(todo) {
    // adds new todo to beginning of todos array
   setTodos([todo, ...todos]);
  // console.log(data)
   //console.log(data.allTasks.edges.map(edge => edge.node.item ));
    setTodos(
    data.allTasks.edges.map(edge => {
      return {
        ...todos,
        id: edge.node.taskId,
        task: edge.node.item,
        completed: edge.node.completed
      }
    }),
    );

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
    deleteFromDB({variables: { taskId: id} });
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

// function fetchTodos(todos){
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;
//  setTodos(
//     data.allTasks.edges.map(edge => {
//       return {
//         ...todos,
//         id: edge.node.taskId,
//         task: edge.node.item,
//         completed: edge.node.completed
//       }
//     }),
//     );
//   }

  return (
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
    
  );
}

export default App;