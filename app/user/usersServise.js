import UserModel from './userModel.js';
import PostModel from '../post/postModel.js';
import UserIntutDto from './userInputDto.js';

const userModule = new UserModel();

export default class UsersService {

    getAll() {
        return userModule.get();
    }

    get(id) {
        return userModule.get(id);
    }

    async delete(id) {
        const postModel = new PostModel();
        const posts = await postModel.get();
        const userPosts = posts.filter(el => el.userId === id);
        if (userPosts.length !== 0) {
            throw new Error(`user with id: ${id} have ${userPosts.length} posts`);
        }

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