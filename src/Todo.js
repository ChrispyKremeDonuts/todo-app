import { Checkbox, IconButton, ListItem, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from '@material-ui/icons/Save';
import React, { useState, setState }  from "react";
import { gql, useQuery } from '@apollo/client';

const GET_TASKS = gql`
query {
  allTasks {
    edges {
      node {
        id
      }
    }
  }
}
`;

function Todo({ todo, toggleComplete, removeTodo, handleSave }) {
  const [taskValue, setTaskValue] = useState(todo.task);
  const [isEditable, setIsEditable] = useState(false);
  const { loading, error, data } = useQuery(GET_TASKS);

  function handleCheckboxClick() {
    toggleComplete(todo.id);
    console.log(data, loading, error);
  }

  function handleRemoveClick() {
    removeTodo(todo.id);
  }

  function handleSaveClick(){
    let newTodo = {...todo};
    if (newTodo.task.trim()){
      newTodo.task = taskValue;
    }
    else {
      newTodo.task = todo.task

    }

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
