import { Button } from "@material-ui/core";
import React, { useState } from "react";
import uuid from "uuid";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

const ADD_TODOS = gql`
	mutation AddTodo($taskId: String!, $task: String!, $index: Int!) {
		createTask(taskId: $taskId, item: $task, index: $index) {
			task {
				item
				completed
				taskId
				index
			}
		}
	}
`;

const GET_MAX_INDEX = gql`
	query maxIndex {
		taskMaxIndex {
			item
			completed
			index
			listId
		}
	}
`;

function TodoForm({ addTodo }) {
	const [todo, setTodo] = useState({
		id: "",
		task: "",
		completed: false,
		index: "",
	});
	const [addTodoToDB] = useMutation(ADD_TODOS);

	const [maxIndex, setMaxIndex] = useState(100);

	const [fetchMaxIndex, { data }] = useLazyQuery(GET_MAX_INDEX, {
		onCompleted: () => {
			let newMax = 100;
			data.taskMaxIndex.forEach((row) => {
				if (row.index) {
					newMax = row.index + 100;
				}
			});
			setMaxIndex(newMax);
		},
	});

	function handleTaskInputChange(e) {
		setTodo({ ...todo, task: e.target.value });
		fetchMaxIndex();
	}

	function handleSubmit(e) {
		e.preventDefault();

		let temp_id = uuid.v4();

		setMaxIndex(maxIndex + 100);
		if (todo.task.trim()) {
			addTodo({ ...todo, id: temp_id, index: maxIndex });
			addTodoToDB({
				variables: { taskId: temp_id, task: todo.task, index: maxIndex },
			});
			setTodo({ ...todo, task: "" });
		}
	}

	return (
		<form className="todo-form" onSubmit={handleSubmit}>
			<input
				label="Task"
				type="text"
				name="task"
				value={todo.task}
				onChange={handleTaskInputChange}
			/>
			<Button type="submit">Submit</Button>
		</form>
	);
}

export default TodoForm;
