import React from 'react';
import { TaskListContainer } from './taskList';
import { TaskDetailContainer } from './taskDetail';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useLocation, useParams } from 'react-router-dom';
import { hasValue } from '/imports/libs/hasValue';

export default (props: IDefaultContainerProps) => {
	const validState = ['view', 'edit', 'create'];

	let { screenState, taskId } = useParams();
	let location = useLocation();

	let modalView = location.pathname.endsWith('/modalView');
	//console.log(`Modal view in container for ${location.pathname}: ${modalView}`);

	const state = screenState ? screenState : props.screenState;

	const id = taskId ? taskId : props.id;

	if (!!state && validState.indexOf(state) !== -1) {
		if (state === 'view' && !!id) {
			return <TaskDetailContainer {...props} screenState={state} id={id} isModalView={modalView} />;
		} else if (state === 'edit' && !!id) {
			return <TaskDetailContainer {...props} screenState={state} id={id} isModalView={modalView} />;
		} else if (state === 'create') {
			return <TaskDetailContainer {...props} screenState={state} id={id} isModalView={modalView} />;
		}
	} else {
		return <TaskListContainer {...props} />;
	}
};
