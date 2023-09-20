import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/taskApi';
import { userprofileApi } from '../../../../userprofile/api/UserProfileApi';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import * as appStyle from '/imports/materialui/styles';
import { nanoid } from 'nanoid';
import { PageLayout } from '/imports/ui/layouts/PageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SearchDocField from '/imports/ui/components/SimpleFormFields/SearchDocField/SearchDocField';
import { IDefaultContainerProps, IDefaultListProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { ITask, TaskData } from '../../api/taskSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { isMobile } from '/imports/libs/deviceVerify';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';
import CustomList from '/imports/ui/components/CustomList/CustomList';

interface ITaskList extends IDefaultListProps {
	remove: (doc: ITask) => void;
	viewComplexTable: boolean;
	setViewComplexTable: (_enable: boolean) => void;
	tasks: ITask[];
	setFilter: (newFilter: Object) => void;
	clearFilter: () => void;
}

const TaskList = (props: ITaskList) => {
	const {
		tasks,
		navigate,
		remove,
		showDrawer,
		showDeleteDialog,
		onSearch,
		total,
		loading,
		viewComplexTable,
		setViewComplexTable,
		setFilter,
		clearFilter,
		setPage,
		setPageSize,
		searchBy,
		pageProperties,
		isMobile
	} = props;

	const idTask = nanoid();

	const onClick = (_event: React.SyntheticEvent, id: string) => {
		navigate('/task/view/' + id);
	};
	const viewTask = (_event: React.SyntheticEvent, id: string) => {
		console.log('vendo tarefa com modal');
		showDrawer && showDrawer({ title: 'Tarefa', url: `/task/view/${id}` });
	};
	const onClickEdit = (doc: ITask) => {
		console.log('Indo para edição de tarefa ', doc);
		navigate('/task/edit/' + doc._id);
	};

	const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
		setPage(newPage + 1);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(1);
	};

	const [text, setText] = React.useState(searchBy || '');

	const change = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearFilter();
		if (text.length !== 0 && e.target.value.length === 0) {
			onSearch();
		}
		setText(e.target.value);
	};
	const keyPress = (_e: React.SyntheticEvent) => {
		// if (e.key === 'Enter') {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
		// }
	};

	const click = (_e: any) => {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
	};

	const callRemove = (doc: ITask) => {
		const title = 'Remover tarefa';
		const message = `Deseja mesmo remover a tarefa "${doc.title}"?`;
		showDeleteDialog && showDeleteDialog(title, message, doc, remove);
	};

	const handleSearchDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		!!e.target.value ? setFilter({ title: e.target.value }) : clearFilter();
	};

	console.log('tarefas: ');
	console.log(tasks);
	// @ts-ignore
	// @ts-ignore
	return (
		<PageLayout title={'Lista de tarefas'} actions={[]}>
			{/*
			<SearchDocField
				api={taskApi}
				subscribe={'taskList'}
				getOptionLabel={(doc) => doc.title || 'error'}
				sort={{ username: 1 }}
				textToQueryFilter={(textoPesquisa) => {
					textoPesquisa = textoPesquisa.replace(/[+[\\?()*]/g, '\\$&');
					return { title: new RegExp(textoPesquisa, 'i') };
				}}
				autocompleteOptions={{ noOptionsText: 'Não encontrado' }}
				name={'title'}
				label={'Pesquisar com SearchDocField'}
				onChange={handleSearchDocChange}
				placeholder={'Todos'}
				showAll={true}
				key={'SearchDocKey'}
			/>
*/}
			<TextField
				name={'pesquisar'}
				label={'Pesquisar'}
				value={text}
				onChange={change}
				onKeyPress={keyPress}
				placeholder="Digite aqui o que deseja pesquisa..."
				action={{ icon: 'search', onClick: click }}
			/>
			<CustomList {...props} tasks={tasks as TaskData[]} />
			{/*
			<SimpleTable
				schema={_.pick(
					{
						...taskApi.schema,
						nomeUsuario: { type: String, label: 'Criado por' }
					},
					['title', 'check', 'description', 'isPrivate', 'nomeUsuario']
				)}
				data={tasks}
				onClick={viewTask}
				actions={[
					{ icon: <Edit />, id: 'edit', onClick: onClickEdit },
					{ icon: <Delete />, id: 'delete', onClick: callRemove }
				]}
			/>
			/*}
			{/*Duvida: como fazer apenas o icone de edit aparecer se o usuario for o criador?*/}
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center'
				}}>
				<TablePagination
					style={{ width: 'fit-content', overflow: 'unset' }}
					rowsPerPageOptions={[10, 25, 50, 100]}
					labelRowsPerPage={''}
					component="div"
					count={total || 0}
					rowsPerPage={pageProperties.pageSize}
					page={pageProperties.currentPage - 1}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
					SelectProps={{
						inputProps: { 'aria-label': 'rows per page' }
					}}
				/>
			</div>

			<RenderComPermissao recursos={[Recurso.EXAMPLE_CREATE]}>
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
						onClick={() => navigate(`/task/create/${idTask}`)}
						color={'primary'}
						variant="extended"
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<Add />
						<span style={{ marginLeft: '8px', fontWeight: 'bold' }}>Adicionar tarefa</span>
					</Fab>
				</div>
			</RenderComPermissao>
		</PageLayout>
	);
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
	pageProperties: {
		currentPage: 1,
		pageSize: 25
	},
	sortProperties: { field: 'createdat', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
});

const taskSearch = initSearch(
	taskApi, // API
	subscribeConfig, // ReactiveVar subscribe configurations
	['title', 'description'] // list of fields
);

let onSearchTaskTyping: NodeJS.Timeout;

const viewComplexTable = new ReactiveVar(false);

export const TaskListContainer = withTracker((props: IDefaultContainerProps) => {
	const { showNotification, showModal, showDrawer } = props;
	//Reactive Search/Filter
	const config = subscribeConfig.get();
	const sort = {
		[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1
	};
	taskSearch.setActualConfig(config);

	//Subscribe parameters
	const filter = { ...config.filter };
	// const filter = filtroPag;
	const limit = config.pageProperties.pageSize;
	const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

	//Collection Subscribe
	const subHandle = taskApi.subscribe('taskList', filter, {
		sort,
		limit,
		skip
	});
	const tasks = subHandle?.ready() ? taskApi.find(filter, { sort }).fetch() : [];

	return {
		tasks,
		loading: !!subHandle && !subHandle.ready(),

		remove: (doc: ITask) => {
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
		},
		viewComplexTable: viewComplexTable.get(),
		setViewComplexTable: (enableComplexTable: boolean) => viewComplexTable.set(enableComplexTable),
		searchBy: config.searchBy,
		onSearch: (...params: any) => {
			onSearchTaskTyping && clearTimeout(onSearchTaskTyping);
			onSearchTaskTyping = setTimeout(() => {
				config.pageProperties.currentPage = 1;
				subscribeConfig.set(config);
				taskSearch.onSearch(...params);
			}, 1000);
		},
		total: subHandle ? subHandle.total : tasks.length,
		pageProperties: config.pageProperties,
		filter,
		sort,
		setPage: (page = 1) => {
			config.pageProperties.currentPage = page;
			subscribeConfig.set(config);
		},
		setFilter: (newFilter = {}) => {
			config.filter = { ...filter, ...newFilter };
			Object.keys(config.filter).forEach((key) => {
				if (config.filter[key] === null || config.filter[key] === undefined) {
					delete config.filter[key];
				}
			});
			subscribeConfig.set(config);
		},
		clearFilter: () => {
			config.filter = {};
			subscribeConfig.set(config);
		},
		setSort: (sort = { field: 'createdat', sortAscending: true }) => {
			config.sortProperties = sort;
			subscribeConfig.set(config);
		},
		setPageSize: (size = 25) => {
			config.pageProperties.pageSize = size;
			subscribeConfig.set(config);
		}
	};
})(showLoading(TaskList));
