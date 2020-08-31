import { gql, useLazyQuery, useMutation, NetworkStatus } from '@apollo/client';
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";


// const GET_TODOS = gql`
// query {
//   allTasks {
//   		edges {
//     		node {
//       		taskId, item, completed
//     			}
//  				}
// 			}
// 		}
// `;
const GET_TODOS = gql`
query Tasks{
  tasks {
    taskId, item, completed, index
  }
}
`;

const DELETE_TODOS = gql`
mutation DeleteTodo($taskId: String!) {
  deleteTask(taskId: $taskId){
    task {
      taskId, item, completed
    }
  }
}
`;


function App() {

  const [todos, setTodos] = useState([]);

  const [deleteFromDB] = useMutation(DELETE_TODOS);

  const [fetchTodos, {data}] = useLazyQuery(GET_TODOS, { onCompleted: () =>     
    setTodos(
    data.tasks.map(row => {
      return {
        ...todos,
        id: row.taskId,
        task: row.item,
        completed: row.completed
      }
    }),
    ),
    //notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    fetchTodos()
  }, [])



  function addTodo(todo) {
   setTodos([...todos, todo]);
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

  // function handleOrder(id)


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