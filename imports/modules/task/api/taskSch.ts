import { IDoc } from '/imports/typings/IDoc';

export const taskSch = {
    image: {
        type: String,
        label: 'Imagem',
        defaultValue: '',
        optional: true,
        isImage: true,
    },
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    check: {
        type: Object,
        label: 'check box',
        defaultValue: 'Todo',
        optional: false,
        options: ['Todo', 'Doing', 'Done'],
    },
    statusToggle: {
        type: Boolean,
        label: 'Tarefa privada?',
        defaultValue: false,
        optional: true,
    },
    statusRadio: {
        type: String,
        label: 'Status RadioButton',
        defaultValue: '',
        optional: true,
        radiosList: ['Todo', 'Doing', 'Done'],
    },
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
