import React, { ReactNode, ReactElement, FC } from 'react';
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

import Close from '@mui/icons-material/Close';

import { ITask } from '../../api/taskSch';
import { IDefaultContainerProps, IDefaultDetailProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { getUser } from '/imports/libs/getUser';
import { Box, IconButton } from '@mui/material';
import { useUserAccount } from '/imports/hooks/useUserAccount';
import { useLocation } from 'react-router-dom';

interface ITaskDetail extends IDefaultDetailProps {
	taskDoc: ITask;
	save: (doc: ITask, _callback?: any) => void;
	isModalView: boolean;
}

type ConditionalWrapperProps = {
	condition: boolean;
	trueWrapper: (children: ReactNode) => ReactElement;
	falseWrapper: (children: ReactNode) => ReactElement;
	children: ReactNode;
};

const ConditionalWrapper: FC<ConditionalWrapperProps> = ({ condition, trueWrapper, falseWrapper, children }) =>
	condition ? trueWrapper(children) : falseWrapper(children);

const TaskDetail = (props: ITaskDetail) => {
	const { isPrintView, screenState, loading, taskDoc, save, navigate, closeComponent, isModalView } = props;

	const { user, userId } = useUserAccount();
	// coloque um || true abaixo para testar a edição limitada
	const isCreator = taskDoc?.createdby === userId;
	//console.log(`Task ${taskDoc?.createdby} and user creator ${user._id}. Created by: ${isCreator}`);

	const location = useLocation();

	const redirectToAnotherState = () => {
		let fromTo = ['view', 'edit'];
		if (screenState == 'edit') {
			fromTo = fromTo.reverse();
		}
		const newPathname = location.pathname.replace(fromTo[0], fromTo[1]);
		console.log(`Estava em ${location.pathname} e estou redirecionando para ${newPathname}`);

		navigate(newPathname, { replace: true });
	};

	if (screenState == 'edit' && !isCreator && taskDoc?._id) {
		redirectToAnotherState();
	}

	const theme = useTheme();

	const redirectAfterSubmit = () => {
		console.log(`Fechando componente! é modal? ${isModalView}`);
		if (isModalView) {
			closeComponent && closeComponent();
		} else {
			navigate('/task');
		}
	};

	const handleSubmit = (doc: ITask) => {
		save(doc, redirectAfterSubmit);
	};
	type MenuBarProps = {
		children: ReactNode;
	};
	const MenuBar: React.FC<MenuBarProps> = ({ children }) => {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<Box display="flex" justifyContent="flex-end" p={1}>
					<IconButton onClick={redirectAfterSubmit}>
						<Close />
					</IconButton>
				</Box>
				<Box flexGrow={1}>{children}</Box>
			</Box>
		);
	};

	type ConditionalWrapperProps = {
		condition: boolean;
		children: ReactNode;
	};

	const ConditionalWrapper: FC<ConditionalWrapperProps> = ({ condition, children }) => {
		//poderia usar o atributo de esconder a barra, porém quero mostrar o X
		const trueWrapper = (children: ReactNode) => <MenuBar>{children}</MenuBar>;
		const falseWrapper = (children: ReactNode) => (
			<PageLayout
				key={'ExemplePageLayoutDetailKEY'}
				title={screenState === 'view' ? 'Visualizar tarefa' : screenState === 'edit' ? 'Editar tarefa' : 'Criar tarefa'}
				onBack={() => navigate('/task')}>
				{children}
			</PageLayout>
		);
		return condition ? trueWrapper(children) : falseWrapper(children);
	};

	return (
		<ConditionalWrapper condition={isModalView}>
			<SimpleForm
				key={'ExempleDetail-SimpleFormKEY'}
				mode={screenState}
				schema={taskApi.getSchema()}
				doc={taskDoc}
				onSubmit={handleSubmit}
				loading={loading}>
				<FormGroup key={'fieldsOne'}>
					<TextField key={'f1-tituloKEY'} placeholder="Titulo" name="title" />
					<Box sx={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
						<TextField key={'f1-descricaoKEY'} placeholder="Descrição" name="description" />
					</Box>
				</FormGroup>

				{screenState !== 'create' ? (
					<CheckBoxField
						name={'check'}
						key={'checkboxStatus'}
						placeholder={'Tarefa concluída'}
						label={'Tarefa concluída'}
					/>
				) : null}

				<ToggleField readOnly={screenState === 'view'} key={'isPrivate'} name="isPrivate" label="Tarefa privada?" />

				<div
					key={'Buttons'}
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'left',
						paddingTop: 20,
						paddingBottom: 20
					}}>
					<Button
						key={'b1'}
						style={{ marginRight: 10 }}
						onClick={() => redirectAfterSubmit()}
						color={'secondary'}
						variant="contained">
						{screenState === 'view' ? 'Voltar' : 'Cancelar'}
					</Button>
					{screenState === 'view' && isCreator ? (
						<Button size="medium" key={'b2'} onClick={redirectToAnotherState} color={'primary'} variant="contained">
							{'Editar'}
						</Button>
					) : null}

					{screenState !== 'view' ? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit">
							{'Salvar'}
						</Button>
					) : null}
				</div>
			</SimpleForm>
		</ConditionalWrapper>
	);
};

interface ITaskDetailContainer extends IDefaultContainerProps {
	isModalView: boolean;
}

export const TaskDetailContainer = withTracker((props: ITaskDetailContainer) => {
	const { screenState, id, navigate, showNotification, isModalView } = props;

	//usa a publication
	const subHandle = !!id ? taskApi.subscribe('taskDetail', { _id: id }) : null;
	//retira o documento
	let taskDoc = id && subHandle?.ready() ? taskApi.findOne({ _id: id }) : {};

	return {
		screenState,
		taskDoc,
		isModalView,
		save: (doc: ITask, _callback: () => void) => {
			const selectedAction = screenState === 'create' ? 'insert' : 'update';
			//Lidando com o valor padrão assim, já que o componente não esta renderizado.
			console.log('Salvando doc ', JSON.stringify(doc));
			if (!doc.check) {
				doc.check = false;
			}
			if (!doc.isPrivate) {
				doc.isPrivate = false;
			}
			taskApi[selectedAction](doc, (e: IMeteorError, r: string) => {
				if (!e) {
					//navigate(`/task/view/${screenState === 'create' ? r : doc._id}`);

					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
						});
					_callback();
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
