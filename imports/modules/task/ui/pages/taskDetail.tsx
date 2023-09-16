import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/taskApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import CheckBoxField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import { PageLayout } from '/imports/ui/layouts/PageLayout';

import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';

import { ITask } from '../../api/taskSch';
import { IDefaultContainerProps, IDefaultDetailProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';

interface ITaskDetail extends IDefaultDetailProps {
	taskDoc: ITask;
	save: (doc: ITask, _callback?: any) => void;
}

const TaskDetail = (props: ITaskDetail) => {
	const { isPrintView, screenState, loading, taskDoc, save, navigate } = props;

	const theme = useTheme();

	const handleSubmit = (doc: ITask) => {
		save(doc);
	};

	console.log('Schema: ', taskApi.getSchema());
	console.log('Doc vindo da publication: ', taskDoc);

	return (
		<PageLayout
			key={'ExemplePageLayoutDetailKEY'}
			title={screenState === 'view' ? 'Visualizar tarefa' : screenState === 'edit' ? 'Editar tarefa' : 'Criar tarefa'}
			onBack={() => navigate('/task')}
			actions={[
				!isPrintView ? (
					<span
						key={'ExempleDetail-spanPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/task/printview/${taskDoc._id}`);
						}}>
						<Print key={'ExempleDetail-spanPrintKEY'} />
					</span>
				) : (
					<span
						key={'ExempleDetail-spanNotPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/task/view/${taskDoc._id}`);
						}}>
						<Close key={'ExempleDetail-spanCloseKEY'} />
					</span>
				)
			]}>
			<SimpleForm
				key={'ExempleDetail-SimpleFormKEY'}
				mode={screenState}
				schema={taskApi.getSchema()}
				doc={taskDoc}
				onSubmit={handleSubmit}
				loading={loading}>
				<FormGroup key={'fieldsOne'}>
					<TextField key={'f1-tituloKEY'} placeholder="Titulo" name="title" />
					<TextField key={'f1-descricaoKEY'} placeholder="Descrição" name="description" />
				</FormGroup>

				<RadioButtonField
					key={'ExempleDetail-RadioKEY'}
					placeholder="Opções da Tarefa"
					name="statusRadio"
					value={'Todo' + ''}
					options={[
						{ value: 'Todo', label: 'Fazendo..' },
						{ value: 'Doing', label: 'Valor B' },
						{ value: 'Done', label: 'Valor C' }
					]}
				/>

				<ToggleField key={'toggleStatus'} name="statusToggle" label="Tarefa privada?" />

				<div
					key={'Buttons'}
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'left',
						paddingTop: 20,
						paddingBottom: 20
					}}>
					{!isPrintView ? (
						<Button
							key={'b1'}
							style={{ marginRight: 10 }}
							onClick={
								screenState === 'edit' ? () => navigate(`/task/view/${taskDoc._id}`) : () => navigate(`/task/list`)
							}
							color={'secondary'}
							variant="contained">
							{screenState === 'view' ? 'Voltar' : 'Cancelar'}
						</Button>
					) : null}

					{!isPrintView && screenState === 'view' ? (
						<Button
							key={'b2'}
							onClick={() => {
								navigate(`/task/edit/${taskDoc._id}`);
							}}
							color={'primary'}
							variant="contained">
							{'Editar'}
						</Button>
					) : null}
					{!isPrintView && screenState !== 'view' ? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit">
							{'Salvar'}
						</Button>
					) : null}
				</div>
			</SimpleForm>
		</PageLayout>
	);
};

interface ITaskDetailContainer extends IDefaultContainerProps {}

export const TaskDetailContainer = withTracker((props: ITaskDetailContainer) => {
	const { screenState, id, navigate, showNotification } = props;

	//usa a publication
	const subHandle = !!id ? taskApi.subscribe('taskDetail', { _id: id }) : null;
	//retira o documento
	let taskDoc = id && subHandle?.ready() ? taskApi.findOne({ _id: id }) : {};

	return {
		screenState,
		taskDoc,
		save: (doc: ITask, _callback: () => void) => {
			const selectedAction = screenState === 'create' ? 'insert' : 'update';
			taskApi[selectedAction](doc, (e: IMeteorError, r: string) => {
				if (!e) {
					navigate(`/task/view/${screenState === 'create' ? r : doc._id}`);
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
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
		}
	};
})(showLoading(TaskDetail));
