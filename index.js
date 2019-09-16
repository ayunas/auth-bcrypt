const express = require('express');
const server = express();
const userRouter = require('./userRouter');

server.use(express.json());

server.use('/users', userRouter);


server.get('/', (req,res) => {
    res.send('<h1>Welcome to the Auth Server');
})


server.listen(9000, () => {
    console.log(`server listening on port 9000`);
})