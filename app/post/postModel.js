const { EntityDriver } = require('../../libs/entities/entityDriver');
const constants = require('../../libs/constants.js');


class PostModel extends EntityDriver {
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

exports.PostModel = PostModel;