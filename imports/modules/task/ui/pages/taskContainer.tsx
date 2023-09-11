import React from 'react';
import { TaskListContainer } from './taskList';
import { TaskDetailContainer } from './taskDetail';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';

export default (props: IDefaultContainerProps) => {
	const validState = ['view', 'edit', 'create'];

	let { screenState, taskId } = useParams();

	const state = screenState ? screenState : props.screenState;

	const id = taskId ? taskId : props.id;

	if (!!state && validState.indexOf(state) !== -1) {
		if (state === 'view' && !!id) {
			return <TaskDetailContainer {...props} screenState={state} id={id} />;
		} else if (state === 'edit' && !!id) {
			return <TaskDetailContainer {...props} screenState={state} id={id} {...{ edit: true }} />;
		} else if (state === 'create') {
			return <TaskDetailContainer {...props} screenState={state} id={id} {...{ create: true }} />;
		}
	} else {
		return <TaskListContainer {...props} />;
	}
};
