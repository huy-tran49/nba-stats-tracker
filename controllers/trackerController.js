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
    const lastName = req.body.lastName
    res.redirect(`tracker/player/${lastName}`)  
})

// show tracker
// router.get('/mine', (req, res) => {
//     const { username, userId, loggedIn } = req.session
//     Player.find({ owner: req.session.userId})
//         .then(players => {
//             const playerLName = player.lastName
//             axios.get(`https://balldontlie.io/api/v1/stats?last_name=beal`)
//                 .then(data => {
//                     const playerStats = data.data
//                     res.render('tracker/mine', { loggedIn, username, userId, players, playerStats })
//                 })
//         })
// })

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
router.get('/player/:lastName', (req, res) => {
    const { username, userId, loggedIn } = req.session
    const playerLName = req.params.lastName
    console.log(playerLName)
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