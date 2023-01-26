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
router.get('/search', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/search', { loggedIn, username, userId })
})

// search player
router.post('/ps', (req, res) => {
    const lastName = req.body.lastName
    res.redirect(`/tracker/player/${lastName}`)  
})

// search team
router.post('/ts', (req, res) => {
    res.redirect(`team`)  
})

//show tracker/mine
router.get('/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
    Player.find({ owner: req.session.userId})
        .then(players => {
            res.render('tracker/mine', { loggedIn, username, userId, players })
         
        })
})

// get all players
router.get('/all', (req, res) => {
    const { username, userId, loggedIn } = req.session
    axios.get('https://balldontlie.io/api/v1/players')
        .then(data => {
            const players = data.data
            res.render('tracker/all', { loggedIn, username, userId, players })
        })
})

// show a player after search
router.get('/player/:lastName', (req, res) => {
    const { username, userId, loggedIn } = req.session
    const playerLName = req.params.lastName
    axios.get(`https://balldontlie.io/api/v1/players?search=${playerLName}`)
        .then(data => {
            const playerData = data.data
            res.render('tracker/player', { loggedIn, username, userId, playerData })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(404)
        })
})

// create a player in the database and assign an owner to the player
router.post('/player', (req, res) => {
    req.body.owner = req.session.userId
    const player = {id: req.body.id , firstName: req.body.firstName, lastName: req.body.lastName, owner: req.body.owner}
    console.log('this is req.body from tracker/player', req.body)
    Player.create(player)
        .then(() => {
            res.redirect('tracker/mine') 
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(404)
        })
})

//show a team after search
router.get('/team', (req, res) => {
    const { username, userId, loggedIn } = req.session
    axios.get(`https://balldontlie.io/api/v1/teams`)
        .then(data => {
            const teamData = data.data
            res.render('tracker/team', { loggedIn, username, userId, teamData })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(404)
        })
    
})

// create a player in the database and assign an owner to the player
router.post('/team', (req, res) => {
    req.body.owner = req.session.userId
    const team = {id: req.body.id , name: req.body.name, city: req.body.city, owner: req.body.owner}
    console.log('this is req.body from tracker/team', req.body)
    Team.create(team)
        .then(() => {
            res.redirect('mine') 
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(404)
        })
})


// tracker main page.
router.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/home', { loggedIn, username, userId })
})

module.exports = router