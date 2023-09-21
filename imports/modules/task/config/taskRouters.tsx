import React from 'react';
import TaskContainer from '../ui/pages/taskContainer';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const taskRouterList: IRoute[] = [
	{
		path: '/task/:screenState/:taskId/modalView',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	},
	{
		path: '/task/:screenState/:taskId',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	},
	{
		path: '/task/:screenState',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_CREATE]
	},
	{
		path: '/task',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.EXAMPLE_VIEW]
	}
];
