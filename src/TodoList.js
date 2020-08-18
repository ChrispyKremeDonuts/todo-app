import { List } from "@material-ui/core";
import React from "react";
import Todo from "./Todo";

function TodoList({ todos, removeTodo, toggleComplete, handleSave }) {
  return (
    <List>
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          toggleComplete={toggleComplete}
          handleSave={handleSave}
        />
      ))}
    </List>
  );
}

export default TodoList;
