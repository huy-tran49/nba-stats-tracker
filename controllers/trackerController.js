////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const Player = require('../models/player')
const Team = require('../models/team')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


module.exports = router

// tracker main page.
router.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/home', { loggedIn, username, userId })
})

//search players and teams 
router.get('/search', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/search', { loggedIn, username, userId })
})

router.get('/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/mine', { loggedIn, username, userId })
})

router.get('/all', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/all', { loggedIn, username, userId })
})