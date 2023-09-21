// region Imports
import { Recurso } from '../config/Recursos';
import { taskSch, ITask } from './taskSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { getUser } from '/imports/libs/getUser';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';
import { IContext } from '/imports/typings/IContext';
import { Meteor } from 'meteor/meteor';
// endregion

class TaskServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('task', taskSch, {
			resources: Recurso
		});

		const self = this;
		this.beforeUpdate = this.beforeUpdate.bind(this);

		this.addTransformedPublication(
			'taskList',
			(filter = {}) => {
				const currentUser = getUser();
				//Recuperar apenas tarefas públicas ou do usuario atual
				const newFilter = {
					...filter,
					$or: [{ createdby: currentUser._id }, { isPrivate: false }]
				};
				//console.log('Novos filtros: ', newFilter);
				return this.defaultListCollectionPublication(newFilter, {
					projection: { check: 1, title: 1, description: 1, isPrivate: 1, createdby: 1, createdat: 1 }
				});
			},
			(doc: ITask & { nomeUsuario: string } & { editable: boolean }) => {
				const currentUser = getUser();

				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc, nomeUsuario: userProfileDoc?.username, editable: currentUser?._id === doc.createdby };
			}
		);

		this.addTransformedPublication(
			'taskRecent',
			(filter = {}) => {
				const currentUser = getUser();
				//Recuperar apenas tarefas públicas ou do usuario atual
				const newFilter = {
					...filter,
					$or: [{ createdby: currentUser._id }, { isPrivate: false }]
				};
				//console.log('Novos filtros: ', newFilter);
				return this.defaultListCollectionPublication(newFilter, {
					projection: { check: 1, title: 1, description: 1, isPrivate: 1, createdby: 1 },
					sort: { createdAt: -1 },
					limit: 4
				});
			},
			(
				doc: ITask & {
					nomeUsuario: string;
				} & {
					editable: boolean;
				}
			) => {
				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc, nomeUsuario: userProfileDoc?.username };
			}
		);

		this.addPublication('taskDetail', (filter = {}) => {
			const currentUser = getUser();

			const newFilter = {
				...filter,
				$or: [{ createdby: currentUser._id }, { isPrivate: false }]
			};
			return this.defaultDetailCollectionPublication(newFilter, {});
		});

		this.addRestEndpoint(
			'view',
			(params, options) => {
				console.log('Params', params);
				console.log('options.headers', options.headers);
				return { status: 'ok' };
			},
			['post']
		);

		this.addRestEndpoint(
			'view/:taskId',
			(params, options) => {
				console.log('Rest', params);
				if (params.taskId) {
					return self
						.defaultCollectionPublication({
							_id: params.taskId
						})
						.fetch();
				} else {
					return { ...params };
				}
			},
			['get'],
			{
				//authFunction: (_h, _p) => _p.taskId === 'flkdsajflkasdjflsa',
			}
		);
	}

	beforeUpdate(docObj: ITask, context: IContext) {
		const user = getUser();

		const tarefaInteira = this.getCollectionInstance().findOne({ _id: docObj._id });
		if (!tarefaInteira) {
			console.log(`Tentando atualizar uma tarefa que nao existe!`);
			throw new Meteor.Error('Acesso negado', `Tarefa com o id fornecido nao existe`);
		}
		//console.log('Verificando se o usuario tem permissao para alterar a tarefa...');
		//console.log(`User: ${JSON.stringify(user)} e documento: ${JSON.stringify(tarefaInteira)}`);
		if (!user) {
			console.log(`Tentando atualizar uma tarefa sem login!`);

			throw new Meteor.Error('Acesso negado', `Você não tem permissão para alterar dados sem login`);
		}
		if (user._id !== tarefaInteira.createdby) {
			console.log(
				`Tentando atualizar uma tarefa com o usuário ${context.user._id} mas o usuário ${tarefaInteira.createdby} não é o mesmo!`
			);

			throw new Meteor.Error('Acesso negado', `Você não tem permissão para alterar esses dados, apenas o criador pode`);
		}

		return super.beforeUpdate(docObj, context);
	}
}

export const taskServerApi = new TaskServerApi();
