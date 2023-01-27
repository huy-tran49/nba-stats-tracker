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
router.get('/mine', (req, res, next) => {
    const { username, userId, loggedIn } = req.session
    const getAllAPI = async () => {
        let savedPlayerData 
        await Player.find({ owner: req.session.userId})
        .then(players => {
            let playerDataAPI = []
            const getPlayerAPI = async () => {
                for (player of players) {
                    let playerdata = {}
                    playerdata.name = `${player.firstName} ${player.lastName}`
                    await axios.get(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${player.idAPI}`)
                        .then(data => {
                            playerdata.stats = data.data.data
                        })  
                        .catch(err => {
                            console.log(err)
                        })
                        playerDataAPI.push(playerdata)
                }
                playerDataAPI = playerDataAPI.flat()
                // res.render('tracker/mine', { loggedIn, username, userId, players, playerDataAPI }) 
                // console.log('this is playerDataAPI',playerDataAPI)
                savedPlayerData = playerDataAPI
                // console.log('this is savedPlayerData inside player',savedPlayerData)
            }
            getPlayerAPI()    
        })
        .catch(err => {
            console.log(err)
        })
        await Team.find({ owner: req.session.userId})
        .then(teams => {
            console.log('this is savedPlayerData inside team',savedPlayerData)
            let teamDataAPI = []
            const getTeamAPI = async () => {
                for (team of teams) {
                    let teamdata = {}
                    await axios.get(`https://www.balldontlie.io/api/v1/teams/${team.idAPI}`)
                        .then(data => {
                            teamdata.stats = data.data
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        teamDataAPI.push(teamdata)
                }
                // console.log('this is teamDataAPI',teamDataAPI)
                teamDataAPI = teamDataAPI.flat()
                res.render('tracker/mine', { loggedIn, username, userId, teamDataAPI, savedPlayerData }) 
                // console.log('this is savedPlayerData inside team',savedPlayerData)
            }
            getTeamAPI()
        })
        .catch(err => {
            console.log(err)
        })
    }
    getAllAPI() 
}) 

// router.get('/mine', (req, res) => {
//     const { username, userId, loggedIn } = req.session
//     Team.find({ owner: req.session.userId})
//         .then(teams => {
//             let teamDataAPI = []
//             const getTeamAPI = async () => {
//                 for (team of teams) {
//                     let teamdata = {}
//                     teamdata
//                     await axios.get(`https://www.balldontlie.io/api/v1/teams/${team.idAPI}`)
//                         .then(data => {
//                             console.log('this is data', data.data)
//                             teamdata.stats = data.data
//                         })
//                         .catch(err => {
//                             console.log(err)
//                         })
//                         teamDataAPI.push(teamdata)
//                 }
//                 console.log(teamDataAPI)
//                 teamDataAPI = teamDataAPI.flat()
//                 res.send('tracker/mine', { loggedIn, username, userId, teamDataAPI }) 
//             }
//             getTeamAPI()
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

// get all players
router.get('/all', (req, res) => {
    const { username, userId, loggedIn } = req.session
    axios.get('https://balldontlie.io/api/v1/players')
        .then(data => {
            const players = data.data
            res.render('tracker/all', { loggedIn, username, userId, players })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(404)
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
    const player = {idAPI: req.body.id , firstName: req.body.firstName, lastName: req.body.lastName, owner: req.body.owner}
    console.log('this is req.body from tracker/player', req.body)
    Player.create(player)
        .then(() => {
            res.redirect('mine') 
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
    const team = {idAPI: req.body.id , name: req.body.name, city: req.body.city, owner: req.body.owner}
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