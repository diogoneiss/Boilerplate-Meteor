import { IDoc } from '/imports/typings/IDoc';

export const taskSch = {
	title: {
		type: String,
		label: 'Título',
		defaultValue: '',
		optional: false
	},
	description: {
		type: String,
		label: 'Descrição',
		defaultValue: '',
		optional: true
	},

	isPrivate: {
		type: Boolean,
		label: 'Tarefa privada?',
		defaultValue: false,
		optional: true
	},
	check: {
		type: Boolean,
		label: 'Tarefa concluída',
		defaultValue: false,
		optional: true
	}
};

export interface ITask extends IDoc {
	image: string;
	title: string;
	description: string;
	check: boolean;
	isPrivate: boolean;
}

export interface TaskData extends ITask {
	nomeUsuario: string;
	editable: boolean;
}
