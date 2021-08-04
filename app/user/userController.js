import UsersService from './usersServise.js';

const usersService = new UsersService();

export default class UserController {
    getAll() {
        return usersService.getAll();
    }

    get(id) {
        return usersService.get(id);
    }

    delete(id) {
        return usersService.delete(id);
    }

    create(entity) {
        return usersService.create(entity);
    }

    update(entity) {
        return usersService.update(entity);
    }
}