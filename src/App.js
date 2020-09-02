import { gql, useLazyQuery, useMutation, NetworkStatus } from '@apollo/client'
import Typography from "@material-ui/core/Typography"
import React, { useEffect, useState } from "react"
import "./App.css"
import TodoForm from "./TodoForm"
import TodoList from "./TodoList"


// const LOCAL_STORAGE_KEY = "todo-list-todos"

const GET_TODOS = gql`
query Tasks{
  tasks {
    taskId, item, completed, index
  }
}
`

const DELETE_TODOS = gql`
mutation DeleteTodo($taskId: String!) {
  deleteTask(taskId: $taskId){
    task {
      taskId, item, completed
    }
  }
}
`

const MOVE_INDEX_UP = gql `
mutation indexUp($CurrentIndex:Int! $prevIndex: Int!) {
  moveIndexUp (CurrentIndex: $CurrentIndex prevIndex: $prevIndex){
    task {
      item
      completed
      index
      taskId
    }
  }
}
`


function App() {

  const [todos, setTodos] = useState([])

  const [deleteFromDB] = useMutation(DELETE_TODOS)
  const [moveIndexUp] = useMutation(MOVE_INDEX_UP)
  const [fetchTodos, {data}] = useLazyQuery(GET_TODOS, { onCompleted: () =>     
    setTodos(
    data.tasks.map(row => {
      return {
        ...todos,
        id: row.taskId,
        task: row.item,
        completed: row.completed,
        index: row.index
      }
    }),
    )
  })

  useEffect(() => {
    fetchTodos()
  }, [])


  function addTodo(todo) {
   setTodos([...todos, todo])
  }


  function toggleComplete(id) {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })
    )
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id))
    deleteFromDB({variables: { taskId: id} })
  }

  function handleSave(newTodo){
      setTodos(
        todos.map(todo => {
          if (todo.id === newTodo.id) {
            return {
              ...newTodo,
              task: newTodo.task
            }
          }
          return todo
        })
      )
  }

  function moveUp(todo){
    let prevIndex = 0
    for (let i=0; i < todos.length; i++){
 //     if(todos[i].index === 0){
          if(todos[i].index === todo.index ){
              prevIndex = (i-1 < 0) ? 0 : i-1
              
              moveIndexUp({variables: { CurrentIndex: todo.index, prevIndex: todos[prevIndex].index } })

              setTodos(
                todos.map(todo => {
                  if(todo.index === todos[i].index)
                      return {
                        ...todo,
                        task: todos[prevIndex].task,
                        completed: todos[prevIndex].completed,
                        index: todos[prevIndex].index
                      }
                      else{
                        if(todo.index === todos[prevIndex].index)
                        return {
                          ...todo,
                          task: todos[i].task,
                          completed: todos[i].completed,
                          index: todos[i].index
                        }
                      }
                      return todo
                    })
                )
              }
        //    }
        }
       // console.log(todos[prevIndex])
         return todos[prevIndex]
    }

    
    function moveDown(todo){
     let nextIndex = 0

      for (let i=0; i < todos.length; i++){
        
            if(todos[i].index === todo.index ){
              
              nextIndex = (i+1 < todos.length-1) ? i+1 : todos.length-1

              moveIndexUp({variables: { CurrentIndex: todos[i].index, prevIndex: todos[nextIndex].index } })

                setTodos(
                  todos.map(todo => {
                    if(todo.index === todos[i].index)
                        return {
                          ...todo,
                          task: todos[nextIndex].task,
                          completed: todos[nextIndex].completed,
                          index: todos[nextIndex].index
                        }
                        else{
                          if(todo.index === todos[nextIndex].index)
                          return {
                            ...todo,
                            task: todos[i].task,
                            completed: todos[i].completed,
                            index: todos[i].index
                          }
                        }
                        return todo
                      })
                  )
                  return
                }
          }
      }


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
          moveUp={moveUp}
          moveDown={moveDown}
          />
      </div>
    
  )
}

export default App