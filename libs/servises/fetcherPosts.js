const { PostModel } = require('../../app/post/postModel.js');
const { Post } = require('../entities/post.js')

const postModel = new PostModel();

class PostFetcher {
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
        const entity = new Post(entityData.text, entityData.userId);
        return postModel.create(entity);
    }

    update(entityData) {
        const entity = new Post(entityData.text, entityData.userId);
        entity.id = entityData.id;
        return postModel.update(entity);
    }
}

exports.PostFetcher = PostFetcher;