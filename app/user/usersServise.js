import UserModel from './userModel.js';
import UserIntutDto from './userInputDto.js';

const userModule = new UserModel();

export default class UsersService {
    constructor(){
        
    }
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