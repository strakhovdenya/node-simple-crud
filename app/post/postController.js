const { PostFetcher } = require('../../libs/servises/fetcherPosts')

const postFetcher = new PostFetcher();

class PostController {
    getAll() {
        return postFetcher.getAll();
    }

    get(id) {
        return postFetcher.get(id);
    }

    delete(id) {
        return postFetcher.delete(id);
    }

    create(entity) {
        return postFetcher.create(entity);
    }

    update(entity) {
        return postFetcher.update(entity);
    }
}

exports.PostController = PostController;