const { PostsService } = require('./postsSerevice')

const postsService = new PostsService();

class PostController {
    getAll() {
        return postsService.getAll();
    }

    get(id) {
        return postsService.get(id);
    }

    delete(id) {
        return postsService.delete(id);
    }

    create(entity) {
        return postsService.create(entity);
    }

    update(entity) {
        return postsService.update(entity);
    }
}

exports.PostController = PostController;