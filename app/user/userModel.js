import EntityDriver from '../../libs/entities/entityDriver.js';
import {constants}  from '../../libs/constants.js';

export default class UserModel extends EntityDriver {
    constructor() {
        super([constants.USER_ENTITY]);
    }

    get(id) {
        return super.get(constants.USER_ENTITY, id)
    }

    create(entity) {
        return super.create(constants.USER_ENTITY, entity)
    }

    delete(id) {
        return super.delete(constants.USER_ENTITY, id)
    }

    update(entity) {
        return super.update(constants.USER_ENTITY, entity)
    }

}