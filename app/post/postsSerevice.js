import PostModel from './postModel.js';
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

    create(entityData) {
        const entity = new PostInputDto(entityData.text, entityData.userId);
        return postModel.create(entity);
    }

    update(entityData) {
        const entity = new PostInputDto(entityData.text, entityData.userId);
        entity.id = entityData.id;
        return postModel.update(entity);
    }
}