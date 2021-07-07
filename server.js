const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');

const postRouter = require('./posts/posts-router');
const userRouter = require('./users/users-router');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res, next) => {
    res.send(`
      <h2>Whatsup</h2>
      `);
});


module.exports = server;