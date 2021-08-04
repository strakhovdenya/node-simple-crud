const { EntityDriver } = require('../../libs/entities/entityDriver');
const constants = require('../../libs/constants.js');


class UserModel extends EntityDriver {
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

exports.UserModel = UserModel;
