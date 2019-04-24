const express = require('express');

const db = require('../data/helpers/postDb');

const router = express.Router();

// GET ALL POSTS
router.get('/', (req, res) => {
    db
    .get()
    .then(db => {
        res.status(200).json(db);
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
});

// ADD A POST
router.post('/', (req, res) => {
    const postInfo = req.body;
    !postInfo.title || !postInfo.contents
    ? res
        .status(400).json({ errorMessage: "Please provide title and contents for the post." })
    : db
        .insert(postInfo)
        .then( post => {
            res.status(201).json(post);
    })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

// GET A POST BY ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
    .getById(id)
    .then(user => {
        if(user.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else {
            res.status(200).json(user);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    });
});

// DELETE A POST
router.delete('/:id', (req, res) => {
    const postID = req.params.id;
    db.remove(postID)
    .then(id => {
        if(id.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(204).end()
        }
        
    })
    .catch(err => {
        res.status(500).json({ error: "The post could not be removed" })
    })
})

// EDIT A POST
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    !changes.title || !changes.contents 
    ? res 
        .status(400).json({ errorMessage: "Please provide title and contents for the post." })
    : db
        .update(id, changes)
        .then(id => {
            if(id === 0){
                res.status(404).json({ message: "The user with the specified ID does not exist." }) 
            }
            db
                .getById(id)
                .then(post => {
                    res.status(200).json(post)
                })
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})

module.exports = router;