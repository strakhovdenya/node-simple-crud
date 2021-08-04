const http = require('http');
// import http from 'http'
require('dotenv').config();
const { Router } = require('./router.js');
const { UserController } = require('../app/user/userController.js');
const { PostController } = require('../app/post/postController.js');

const router = new Router();
const userController = new UserController();
const postController = new PostController();

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


const server = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    router.handleRequest(res, req);
});

server.listen(8000);



