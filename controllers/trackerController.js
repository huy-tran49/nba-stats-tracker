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

router.get('/', (req, res) => {
    res.render('tracker/home')
})
