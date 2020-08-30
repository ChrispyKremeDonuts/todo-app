import { Checkbox, IconButton, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from '@material-ui/icons/Save';
import React, { useState }  from "react";
import { gql, useMutation } from '@apollo/client';

const UPDATE_TODOS = gql`
mutation UpdateTodo($taskId: Int! $task: String!) {
  updateTask(taskId: $taskId, item: $task){
    task {
      taskId, item, completed
    }
  }
}

`;



function Todo({ todo, toggleComplete, removeTodo, handleSave }) {
  const [taskValue, setTaskValue] = useState(todo.task);
  const [isEditable, setIsEditable] = useState(false);
  const [EditTodoDb, data] = useMutation(UPDATE_TODOS);
  

  function handleCheckboxClick() {
    toggleComplete(todo.id);
  }

  function handleRemoveClick() {
    removeTodo(todo.id);
  }

  function handleSaveClick(){
    let newTodo = {...todo};
    newTodo.task = taskValue;
    EditTodoDb({variables: { taskId: todo.id, task: newTodo.task } });

    handleSave(newTodo)
    setIsEditable(false)
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
    <ListItem style={{ display: "flex" }}>
      <Checkbox checked={todo.completed} onClick={handleCheckboxClick} />
      <span style={{
                textDecoration: todo.completed ? "line-through" : null
              }} onClick={() => setIsEditable(true)}>{taskValue }</span>
      <IconButton onClick={handleRemoveClick}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}

export default Todo;
