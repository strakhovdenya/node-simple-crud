const { UserModel } = require('../../app/user/userModel.js')
const { User } = require('../entities/user.js')

const userModule = new UserModel();

class UserFetcher {
    getAll() {
        return userModule.get();
    }

    get(id) {
        return userModule.get(id);
    }

    delete(id) {
        return userModule.delete(id);
    }

    create(entityData) {
        const entity = new User(entityData.name, entityData.age);
        return userModule.create(entity);
    }

    update(entityData) {
        const entity = new User(entityData.name, entityData.age);
        entity.id = entityData.id;
        return userModule.update(entity);
    }
}

exports.UserFetcher = UserFetcher;