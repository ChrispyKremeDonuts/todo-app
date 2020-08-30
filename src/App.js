import { gql, useQuery, useMutation, ApolloProvider, ApolloClient } from '@apollo/client';
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

  const client = new ApolloClient({
    uri: "http://127.0.0.1:5000/graphql",
    cache: new InMemoryCache(),
  });

  // const link = onError(({ graphQLErrors, networkError }) => {
  //   if (graphQLErrors)
  //     graphQLErrors.forEach(({ message, locations, path }) =>
  //       console.log(
  //         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //       )
  //     );
  //   if (networkError) console.log(`[Network error]: ${networkError}`);
  // });

  //const link = createPersistedQueryLink().concat(createHttpLink({ uri: "http://localhost:5000/graphql?query=%7BallTasks%20%7B%0A%20%20edges%20%7B%0A%20%20%20%20node%20%7B%0A%20%20%20%20%20%20taskId%2C%20item%2C%20completed%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20__typename%0A%7D%7D" }))
  
  // const link = ApolloLink.from([
  //   createPersistedQueryLink({ useGETForHashedQueries: true }),
  //   createHttpLink({ uri: "http://localhost:5000/graphql?query=%7BallTasks%20%7B%0A%20%20edges%20%7B%0A%20%20%20%20node%20%7B%0A%20%20%20%20%20%20taskId%2C%20item%2C%20completed%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20__typename%0A%7D%7D" })
  // ]);

  // const client = new ApolloClient({
  //   uri: "http://127.0.0.1:5000/graphql",
  //   cache: new InMemoryCache(),
  //   link: link,
  // });


  const [todos, setTodos] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_TODOS);
  const [deleteFromDB, {dataDelete}] = useMutation(DELETE_TODOS);
  
  // function fetchTodos(){{
  //   setTodos(
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
  // }
  



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
   fetchTodos()
   setTodos([todo, ...todos]);
  //  setTodos([todo,  data.allTasks.edges.map(edge => {
  //   return {
  //     ...todo,
  //     id: edge.node.taskId,
  //     task: edge.node.item,
  //     completed: edge.node.completed
  //   }
  // })]);
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
    // setTodos([todo, ...todos]);
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

function fetchTodos(todos){
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
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
