import PostsService from './postsSerevice.js';

const postsService = new PostsService();

export default class PostController {
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