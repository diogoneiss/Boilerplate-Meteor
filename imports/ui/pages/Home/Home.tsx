import React, { useContext } from 'react';
import { useTracker, withTracker } from 'meteor/react-meteor-data';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';

import { nanoid } from 'nanoid';
import { PageLayout } from '/imports/ui/layouts/PageLayout';

import { IDefaultContainerProps, IDefaultListProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';

import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { isMobile } from '/imports/libs/deviceVerify';
import { showLoading } from '/imports/ui/components/Loading/Loading';

import CustomList from '/imports/ui/components/CustomList/CustomList';
import { AppContext } from '/imports/ui/AppGeneralComponents';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '/imports/modules/task/api/taskApi';
import { ITask, TaskData } from '/imports/modules/task/api/taskSch';
import { Typography } from '@mui/material';
import { getUser } from '/imports/libs/getUser';

interface ITaskList extends IDefaultListProps {
	remove: (doc: ITask) => void;
	tasks: ITask[];
}

const TaskList = (props: ITaskList) => {
	const { tasks, navigate, remove } = props;

	const idTask = nanoid();
	const user = getUser();

	// @ts-ignore
	return (
		<PageLayout hiddenTitleBar={true} title={'Home'} actions={[]}>
			<h1>Olá, {user?.username}</h1>
			<p>Seus projetos muito mais organizados.</p>
			<h2>Atividades recentes</h2>
			<CustomList {...props} remove={remove} tasks={tasks as TaskData[]} />

			<div
				style={{
					position: 'fixed',
					bottom: isMobile ? 80 : 30,
					left: '50%',
					transform: 'translateX(-50%)',
					borderRadius: '50%'
				}}>
				<Fab
					id={'add'}
					onClick={() => navigate(`/task`)}
					color={'primary'}
					variant="extended"
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<span style={{ marginLeft: '8px', fontWeight: 'bold' }}>Ver tarefas </span>
					<ArrowForwardRoundedIcon />
				</Fab>
			</div>
		</PageLayout>
	);
};

export const TaskListContainer = (props: IDefaultContainerProps) => {
	// @ts-ignore
	const { showNotification } = useContext(AppContext);
	const navigate = useNavigate();
	const { tasks, loading } = useTracker(() => {
		const pubOptions = {
			limit: 5,
			sort: { createdat: -1 }
		};

		const subHandle = taskApi.subscribe('taskList', {}, pubOptions);
		const tasksData = subHandle?.ready() ? taskApi.find({}, {}).fetch() : [];
		const isLoading = !!subHandle && !subHandle.ready();

		return { tasks: tasksData, loading: isLoading };
	}, []);

	const remove = (doc: ITask) => {
		taskApi.remove(doc, (e: IMeteorError) => {
			if (!e) {
				showNotification &&
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						description: `O exemplo foi removido com sucesso!`
					});
			} else {
				console.log('Error:', e);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Operação não realizada!',
						description: `Erro ao realizar a operação: ${e.reason}`
					});
			}
		});
	};

	const WrappedTaskList = showLoading(TaskList);

	return <WrappedTaskList {...props} tasks={tasks} loading={loading} remove={remove} navigate={navigate} />;
};

export default TaskListContainer;
