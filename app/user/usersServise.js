const { UserModel } = require('./userModel.js')
const { UserIntutDto } = require('./userInputDto.js')

const userModule = new UserModel();

class UsersService {
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
        const entity = new UserIntutDto(entityData.name, entityData.age);
        return userModule.create(entity);
    }

    update(entityData) {
        const entity = new UserIntutDto(entityData.name, entityData.age);
        entity.id = entityData.id;
        return userModule.update(entity);
    }
}

exports.UsersService = UsersService;