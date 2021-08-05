import PostModel from './postModel.js';
import UserModel from '../user/userModel.js';
import PostInputDto from './postInputDto.js';

const postModel = new PostModel();

export default class PostsService {
    getAll() {
        return postModel.get();
    }

    get(id) {
        return postModel.get(id);
    }

    delete(id) {
        return postModel.delete(id);
    }

    async create(entityData) {
        const entity = new PostInputDto(entityData.text, entityData.userId);
        const userModel = new UserModel();
        const user = await userModel.get(entity.userId);
        if (user.length === 0) {
            throw new Error(`user with id: ${entity.userId} is absent`);
        }

        return postModel.create(entity);
    }

    async update(entityData) {
        const entity = new PostInputDto(entityData.text, entityData.userId);

        const userModel = new UserModel();
        const user = await userModel.get(entity.userId);
        if (user.length === 0) {
            throw new Error(`user with id: ${entity.userId} is absent`);
        }
        
        entity.id = entityData.id;
        return postModel.update(entity);
    }
}