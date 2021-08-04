
import 'dotenv/config';
// require('dotenv').config();
import http from 'http';
import { constants } from '../libs/constants.js';
import EntityDriver from '../libs/entities/entityDriver.js';


import Router from './router.js';

import UserController from './user/userController.js';
import PostController from './post/postController.js';

const router = new Router();
const userController = new UserController();
const postController = new PostController();
const dbDriver = new EntityDriver([constants.POST_ENTITY, constants.USER_ENTITY]);

router.get('/users', userController.getAll);
router.get('/user/{:id}', userController.get);
router.delete('/user', userController.delete);
router.put('/user', userController.create);
router.patch('/user', userController.update);

router.get('/posts', postController.getAll);
router.get('/post/{:id}', postController.get);
router.delete('/post', postController.delete);
router.put('/post', postController.create);
router.patch('/post', postController.update);

const init = async () => {
    await dbDriver.init();
    
    const server = http.createServer((req, res) => {

        res.writeHead(200, { 'Content-Type': 'application/json' });
        router.handleRequest(res, req);
    });

    server.listen(8000);
}

init();



