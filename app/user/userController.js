const { UserFetcher } = require('../../libs/servises/fetcherUsers.js')

const userFetcher = new UserFetcher();

class UserController {
    getAll() {
        return userFetcher.getAll();
    }

    get(id) {
        return userFetcher.get(id);
    }

    delete(id) {
        return userFetcher.delete(id);
    }

    create(entity) {
        return userFetcher.create(entity);
    }

    update(entity) {
        return userFetcher.update(entity);
    }
}

exports.UserController = UserController;