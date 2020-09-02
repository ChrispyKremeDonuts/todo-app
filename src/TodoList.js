import { List } from "@material-ui/core";
import React from "react";
import Todo from "./Todo";

function TodoList({ todos, removeTodo, toggleComplete, handleSave, moveUp, moveDown, Complete }) {
  return (
    <List>
      {todos.sort((a, b) => a.index > b.index ? 1 : -1)
      .map(todo => (
        <Todo 
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        toggleComplete={toggleComplete}
        handleSave={handleSave}
        moveUp={moveUp}
        moveDown={moveDown}
        />
      ))}
    </List>
  );
}

export default TodoList;
