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
	check: {
		type: Object,
		label: 'check box',
		defaultValue: 'Todo',
		optional: true,
		options: ['Todo', 'Doing', 'Done']
	},
	statusToggle: {
		type: Boolean,
		label: 'Tarefa privada?',
		defaultValue: false,
		optional: true
	},
	statusRadio: {
		type: String,
		label: 'Status RadioButton',
		defaultValue: 'Todo',
		optional: false,
		radiosList: ['Todo', 'Doing', 'Done']
	}
};

export interface ITask extends IDoc {
	image: string;
	title: string;
	description: string;
	check: Object;
	statusCheck: object;
	statusToggle: boolean;
	statusRadio: string;
}
