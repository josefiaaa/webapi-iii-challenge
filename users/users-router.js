const express = require('express');

const db = require('../data/helpers/userDb');

const router = express.Router();

function drunkWithPower(req, res, next) {
    let name = req.body.name;
    if (name === name.toUpperCase()) {
      next();
    } else {
      req.body.name = name.toUpperCase();
      next();
    }
}

// GET ALL USERS
router.get('/', (req, res) => {
    db
    .get()
    .then(db => {
        res.status(200).json(db);
    })
    .catch(err => {
        res.status(500).json({ error: "This users information could not be retrieved." });
    })
});

// ADD A USER
router.post('/', drunkWithPower, (req, res) => {
    const userInfo = req.body;
    !userInfo.name
    ? res
        .status(400).json({ errorMessage: "Please provide a username." })
    : db
        .insert(userInfo)
        .then( user => {
            res.status(201).json(user);
    })
        .catch( err => {
            res.status(500).json({ error: "There was an error while adding this user to the database. Please try again with a unique name." })
    })
})

// GET A USER BY THEIR ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
    .getById(id)
    .then(user => {
        if(user.length === 0) {
            res.status(404).json({ message: "A user with this ID does not exist." });
        } else {
            res.status(200).json(user);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user's information could not be retrieved." })
    });
});

//GET A USERS POST BY ID ////////
router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await db.getUserPosts(req.params.id);
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ error: "These posts could not be retrieved." })
    }
})

// DELETE ACCOUNT
router.delete('/:id', (req, res) => {
    const userID = req.params.id;
    db.remove(userID)
    .then(id => {
        if(id.length === 0){
            res.status(404).json({ message: "A user with this ID does not exist." })
        } else {
            res.status(200).json({ message: "This user was deleted successfully." })
        }
        
    })
    .catch(err => {
        res.status(500).json({ error: "The account could not be deleted." })
    })
})

// EDIT A USER
router.put('/:id', drunkWithPower, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    !changes.name 
    ? res 
        .status(400).json({ errorMessage: "Please provide a username." })
    : db
        .update(id, changes)
        .then(id => {
            if(id === 0){
                res.status(404).json({ message: "The user with the specified ID does not exist." }) 
            }
            db
                .getById(id)
                .then(user => {
                    res.status(200).json(changes)
                })
        })
        .catch(err => {
            res.status(500).json({ error: "The username could not be modified." })
        })
})

module.exports = router;