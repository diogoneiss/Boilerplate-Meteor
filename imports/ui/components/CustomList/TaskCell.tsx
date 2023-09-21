import React, { useContext } from 'react';
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
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import Divider from './Divider';

import { AppContext } from '/imports/ui/AppGeneralComponents';

interface TaskCellProps extends IDefaultContainerProps {
	task: TaskData;
	remove: (doc: ITask) => void;
}

function TaskCell(props: TaskCellProps) {
	const { task, remove, showDeleteDialog, showDrawer, navigate, closeComponent } = props;
	const context = useContext(AppContext);
	// @ts-ignore
	let { showModal } = context;

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
	//TODO terminar isso pra usar no checkbox
	const onClickCheckbox = () => {
		console.log('Clicou no checkbox');
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
						readOnly={true}
						checked={task.check}
					/>
					<Box>
						<ListItemText primary={<Box component="span">{task.title}</Box>} />
						<ListItemText
							primary={
								<Box component="span" sx={{ color: 'grey' }}>
									{`Criada por ${criador} em ${task.createdat?.toLocaleDateString()}`}
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
