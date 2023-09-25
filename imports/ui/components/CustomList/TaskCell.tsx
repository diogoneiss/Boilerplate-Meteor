import React, { useContext, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import Box from '@mui/material/Box';
import { ITask, TaskData } from '/imports/modules/task/api/taskSch';
import { IDefaultContainerProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import Divider from './Divider';

import { AppContext } from '/imports/ui/AppGeneralComponents';
import { taskApi } from '/imports/modules/task/api/taskApi';

interface TaskCellProps extends IDefaultContainerProps {
	task: TaskData;
	remove: (doc: ITask) => void;
}

function TaskCell(props: TaskCellProps) {
	const { task, remove, showDrawer, navigate, closeComponent } = props;
	const [completed, setCompleted] = useState(task.check);

	const context = useContext(AppContext);
	// @ts-ignore
	let { showModal, showNotification, showDeleteDialog } = context;

	//console.log('Context: ', context);
	const editable = task.editable;
	let criador = task.nomeUsuario;

	if (task.createdby == props.user?._id) {
		criador = 'Você';
	}
	const callRemove = () => {
		const title = 'Remover tarefa';
		const message = `Deseja mesmo remover a tarefa "${task.title}"?`;
		showDeleteDialog && showDeleteDialog(title, message, task, remove);
	};

	const viewTask = () => {
		console.log(`vendo tarefa com modal, url=/task/view/${task._id}/modalView`);

		showModal && showModal({ title: 'Tarefa', url: `/task/view/${task._id}/modalView`, modalOnClose: true });

		//showDrawer && showDrawer({ title: 'Tarefa', url: `/task/view/${task._id}` });
		//context?.showNotification('Notification message');
	};
	const onClickCheckbox = () => {
		if (!editable) {
			return;
		}

		task.check = !task.check;

		taskApi.update(task, (e: IMeteorError) => {
			if (e) {
				console.log('Error: ', e);
				showNotification({
					type: 'warning',
					title: 'Operação não realizada!',
					description: `Erro ao realizar a operação: ${e.reason}`
				});
			} else {
				setCompleted(!completed);
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					description: `Estado da tarefa alterado com sucesso!`
				});
			}
		});
	};

	const onClickEdit = () => {
		console.log('Indo para edição de tarefa ', task);
		showModal && showModal({ title: 'Tarefa', url: `/task/edit/${task._id}/modalView`, modalOnClose: true });
	};

	return (
		<>
			<ListItem key={task._id} onClick={() => viewTask()} button>
				<Box display="flex" flex={1} alignItems="center">
					<Checkbox
						checkedIcon={<CheckCircleRoundedIcon />}
						icon={<CircleOutlinedIcon />}
						readOnly={!editable}
						checked={completed}
						disableRipple={!editable}
						onClick={(e) => {
							e.stopPropagation();
							onClickCheckbox();
						}}
						sx={{
							pointerEvents: editable ? 'all' : 'none',
							'&:hover': editable ? {} : { backgroundColor: 'transparent' }
						}}
					/>
					<Box>
						<ListItemText
							primary={
								<Box component="span" sx={{ textDecoration: task.check ? 'line-through' : 'none' }}>
									{task.title}
								</Box>
							}
						/>
						<ListItemText
							primary={
								<Box component="span" sx={{ color: 'grey' }}>
									{`Criada por ${criador}`}
								</Box>
							}
							sx={{ marginTop: '0' }}
						/>
					</Box>
				</Box>
				{editable ? (
					<Box display="flex" alignItems="center">
						<Edit
							id="edit"
							onClick={(e) => {
								e.stopPropagation();
								onClickEdit();
							}}
							style={{ cursor: 'pointer' }}
						/>
						<Delete
							id="delete"
							onClick={(e) => {
								e.stopPropagation();
								callRemove();
							}}
							style={{ cursor: 'pointer' }}
						/>
					</Box>
				) : null}
			</ListItem>
			<Divider />
		</>
	);
}

export default TaskCell;
