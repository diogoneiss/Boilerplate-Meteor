import React, { useContext } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { ITask, TaskData } from '/imports/modules/task/api/taskSch';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import Divider from './Divider';
import { AppContext } from '/imports/ui/AppGeneralComponents';
import { Simulate } from 'react-dom/test-utils';
import contextMenu = Simulate.contextMenu;

interface TaskCellProps extends IDefaultContainerProps {
	task: TaskData;
	remove: (doc: ITask) => void;
}

function TaskCell(props: TaskCellProps) {
	const { task, remove, showDeleteDialog, showDrawer, navigate, closeComponent } = props;
	const context = useContext(AppContext);
	console.log('Context: ', context);
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
		console.log('vendo tarefa com modal');
		showDrawer && showDrawer({ title: 'Tarefa', url: `/task/view/${task._id}` });
		context?.showNotification('Notification message');
		console.log('Closecomponent: ', closeComponent);
		closeComponent && closeComponent();
	};

	const onClickEdit = () => {
		console.log('Indo para edição de tarefa ', task);
		navigate('/task/edit/' + task._id);
	};

	return (
		<>
			<ListItem key={task._id} onClick={() => viewTask()} button>
				<Box display="flex" flex={1} alignItems="center">
					<Checkbox readOnly={true} checked={task.check} />
					<Box>
						<ListItemText primary={<Box component="span">{task.title}</Box>} />
						<ListItemText
							primary={
								<Box component="span" sx={{ color: 'grey' }}>
									{'Criada por ' + criador}
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
