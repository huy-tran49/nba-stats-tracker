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
const axios = require('axios')

module.exports = router

//add form for players and teams 
router.get('/add', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/addPlayer', { loggedIn, username, userId })
})

router.post('/', (req, res) => {
    req.body.owner = req.session.userId
    console.log(req.body)
    Player.create(req.body)
        .then(player => {
            console.log(player)
            // res.redirect('tracker/mine')
        })
        .catch(err => {
            console.log(err)
            res.redirect('tracker/mine')
        })
})

// show tracker
router.get('/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/mine', { loggedIn, username, userId })

})

// get all players
router.get('/all', (req, res) => {
    const { username, userId, loggedIn } = req.session
    // res.render('tracker/all', { loggedIn, username, userId })
    axios.get('https://balldontlie.io/api/v1/players')
        .then(data => {
            const players = data.data
            res.render('tracker/all', { loggedIn, username, userId, players })
        })
})

// router.

// show a player after search
router.get('/player/:playerName', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/player', { loggedIn, username, userId })
})

//show a team after search
router.get('/search/:teamName', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/team', { loggedIn, username, userId })
})

// tracker main page.
router.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/home', { loggedIn, username, userId })
})

module.exports = router