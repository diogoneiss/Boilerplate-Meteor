import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import TaskCell from './TaskCell';
import { ITask, TaskData } from '/imports/modules/task/api/taskSch';
import { IDefaultListProps } from '/imports/typings/BoilerplateDefaultTypings';
import Divider from './Divider';
interface TaskListProps extends IDefaultListProps {
	tasks: TaskData[];
	remove: (doc: ITask) => void;
}

export function TaskList(props: TaskListProps) {
	const { tasks, remove, ...otherProps } = props;
	return (
		<>
			<Divider />
			<List>
				{tasks.map((task, index) => (
					<TaskCell key={index} remove={remove} task={task} {...otherProps} />
				))}
			</List>
		</>
	);
}

export default TaskList;
