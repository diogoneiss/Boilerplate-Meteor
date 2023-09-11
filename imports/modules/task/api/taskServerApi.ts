// region Imports
import { Recurso } from '../config/Recursos';
import { taskSch, ITask } from './taskSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
// endregion

class TaskServerApi extends ProductServerBase<ITask> {
    constructor() {
        super('task', taskSch, {
            resources: Recurso,
        });

        const self = this;

        this.addTransformedPublication(
            'taskList',
            (filter = {}) => {
                return this.defaultListCollectionPublication(filter, {
                    projection: { image: 1, title: 1, description: 1, createdby: 1 },
                });
            },
            (doc: ITask & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addPublication('taskDetail', (filter = {}) => {
            return this.defaultDetailCollectionPublication(filter, {});
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
                            _id: params.taskId,
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
}

export const taskServerApi = new TaskServerApi();
