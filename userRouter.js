const express = require('express');
const userRouter = express.Router();
const DB = require('./dbConfig');
const bcryptjs = require('bcryptjs');


userRouter.get('/', authenticate, (req,res) => {
    console.log('in the get users');
    DB.select('*').from('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err.message))
})

userRouter.get('/:id', authenticate, (req,res) => {
    DB.select('*').from('users').where('id',req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({missing: "sorry. that user was not found"});
        }
    })
    .catch(err => res.status(500).json(err.message));
})

userRouter.post('/register', (req,res) => {
    const newUser = req.body;
    const hash = bcryptjs.hashSync(newUser.password, 10);
    newUser.password = hash;

    DB.insert(newUser).into('users')
    .then( ([id]) => {
        DB.select('*').from('users').where('id',id)
        .then(([user]) => res.status(201).json(user))
    })
    .catch(err => res.status(500).json(err.message))
})

userRouter.post('/login', authenticate, (req,res) => {
    const credentials = req.body;
    console.log('in login', credentials);
    const {id} = req.headers;
    if (!id) {
        DB.select('*').from('users').where({username : credentials.username})
    .then(([user]) => res.status(200).json(user))
    .catch(err => res.status(500).json(err.message))
    }
    
    DB.select('*').from('users').where('id',id)
    .then(([user]) => res.status(200).json(user))
    .catch(err => res.status(500).json(err.message))
})


function authenticate(req,res,next) {
    console.log('in the middleware');
    // const {password, username} = req.body || req.headers;
    const id = req.params.id || req.headers.id;
    const password = req.body.password || req.headers.password;
    console.log(req.body.username);

    if (password) {
        DB.select('*').from('users').where({username : req.body.username})
        .then( ([user]) => {
            if (user && bcryptjs.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({unauthorized: "So sorry, your credentials are not valid"})
            }
        })
        .catch(err => res.status(500).json(err.message))
    } else {
        res.status(400).json({error: "id and password must be present"})
    }
}

module.exports = userRouter;

