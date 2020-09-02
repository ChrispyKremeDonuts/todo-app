import { Checkbox, IconButton, ListItem } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import SaveIcon from '@material-ui/icons/Save'
import React, { useState }  from "react"
import { gql, useMutation, useQuery } from '@apollo/client'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Box from '@material-ui/core/Box'




const UPDATE_TODOS = gql `
mutation updateTask($taskId: String! $task: String! $completed: Boolean! $index: Int!) {
  updateTodo(taskId: $taskId, item: $task, completed: $completed, index: $index){
    task {
      taskId, item, completed, index
    }
  }
}
`

const GET_TODOS = gql`
query Tasks{
  tasks {
    taskId, item, completed, index
  }
}`



function Todo({ todo, toggleComplete, removeTodo, handleSave, moveUp, moveDown }) {
  const [taskValue, setTaskValue] = useState(todo.task)
  const [task, setTask] = useState(todo)
  const [isEditable, setIsEditable] = useState(false)
  const [EditTodoDb] = useMutation(UPDATE_TODOS)


  function handleCheckboxClick() {
    toggleComplete(todo.id)
    EditTodoDb({variables: { taskId: todo.id, task: todo.task, completed: !todo.completed, index: todo.index } })
  }



  function handleRemoveClick() {
    removeTodo(todo.id)
  }

  function handleSaveClick(){
    let newTodo = {...todo}
    newTodo.task = taskValue
    EditTodoDb({variables: { taskId: todo.id, task: newTodo.task, completed: todo.completed, index: todo.index } })
    handleSave(newTodo)
    setIsEditable(false)
}

function handleUpClick(){
 // setTask(moveUp(todo))
 moveUp(todo)
}

function handleDownClick(){
  moveDown(todo)
}

  return isEditable ? (
    <ListItem style={{ display: "flex" }}>
      <Checkbox checked={todo.completed} onClick={handleCheckboxClick} />
       <input
            style={{
                textDecoration: todo.completed ? "line-through" : null
              }}
          value={taskValue}
          onChange={(e) => {setTaskValue(e.currentTarget.value)}}
        />
      <IconButton onClick={handleSaveClick}>
        <SaveIcon/>
      </IconButton>
    </ListItem>
  ) : (
    <ListItem style={{alignItems:'left', display: "flex" }}>
        <Checkbox checked={todo.completed} onClick={handleCheckboxClick} />
        <span style={{
          textDecoration: todo.completed ? "line-through" : null
                }} onClick={() => setIsEditable(true)}>{taskValue }</span>
        <Box component="span" m={1}>
            <ArrowUpwardIcon onClick={handleUpClick}/>
        </Box>
        <ArrowDownwardIcon onClick={handleDownClick}/>
      <IconButton onClick={handleRemoveClick}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  )
}

export default Todo
