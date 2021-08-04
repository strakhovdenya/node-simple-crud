import EntityDriver from '../../libs/entities/entityDriver.js';
import {constants}  from '../../libs/constants.js';


export default class PostModel extends EntityDriver {
    constructor() {
        super([constants.POST_ENTITY]);
    }

    get(id) {
        return super.get(constants.POST_ENTITY, id);
    }

    create(entity) {
        return super.create(constants.POST_ENTITY, entity)
    }

    delete(id) {
        return super.delete(constants.POST_ENTITY, id)
    }

    update(entity) {
        return super.update(constants.POST_ENTITY, entity)
    }
}