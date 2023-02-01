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

// search player, accept a player nane and use that a param in redirect
router.post('/ps', (req, res) => {
    const lastName = req.body.lastName
    if (lastName){
        res.redirect(`/tracker/player/${lastName}`)  
    } else {
        let error = 'Please enter a name in the search field'
        res.redirect(`/error?error=${error}`)
    }
    
})

// search team, show all teams
router.post('/ts', (req, res) => {
    res.redirect(`team`)  
})
 
//show tracker for player
router.get('/player/myplayer', (req, res) => {
    const { username, userId, loggedIn } = req.session
    Player.find({ owner: req.session.userId})
        .then(players => {
            let playerDataAPI = []
            const getPlayerAPI = async () => {
                for (player of players) {
                    let playerdata = {}
                    playerdata.name = `${player.firstName} ${player.lastName}`
                    playerdata.idAPI = player.idAPI
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
                // console.log('this is playerDataAPI',playerDataAPI)
                res.render('tracker/myplayer', { loggedIn, username, userId, playerDataAPI}) 
            }
            getPlayerAPI()    
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
}) 

//show tracker for player
router.get('/team/myteam', (req, res) => {
    const { username, userId, loggedIn } = req.session
    Team.find({ owner: req.session.userId})
        .then(teams => {
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
                teamDataAPI = teamDataAPI.flat()
                // console.log('this is teamDataAPI',teamDataAPI)
                res.render('tracker/myteam', { loggedIn, username, userId, teamDataAPI }) 
            }
            getTeamAPI()
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
 
}) 
// get score
router.get('/all/:date', (req, res) => {
    const { username, userId, loggedIn } = req.session
    const date = req.params.date
    axios.get(`https://www.balldontlie.io/api/v1/stats?seasons[]=2022&dates[]=${date}`)
        .then(data => {
            const games = data.data.data
            console.log(games)
            res.render('tracker/all', { loggedIn, username, userId, games, date })
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// get date from tracker/all
router.post('/all', (req, res) => {
    const date = req.body.date
    res.redirect(`all/${date}`)
})

// show the initial page for /tracker/all
router.get('/all', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/all', {loggedIn, username, userId})
})



// show a player after search
router.get('/player/:lastName', (req, res) => {
    const { username, userId, loggedIn } = req.session
    const playerLName = req.params.lastName
    axios.get(`https://balldontlie.io/api/v1/players?search=${playerLName}`)
        .then(data => {
            const playerData = data.data
            res.render('tracker/player', { loggedIn, username, userId, playerData, playerLName })
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// create a player in the database and assign an owner to the player
router.post('/player', (req, res) => {
    req.body.owner = req.session.userId
    const player = {
        idAPI: req.body.id , 
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        owner: req.body.owner
    }
    console.log('this is req.body from tracker/player', req.body)
    Player.create(player)
        .then(() => {
            res.redirect('player/myplayer') 
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

//show all teams 
router.get('/team', (req, res) => {
    const { username, userId, loggedIn } = req.session
    axios.get(`https://balldontlie.io/api/v1/teams`)
        .then(data => {
            const teamData = data.data
            res.render('tracker/team', { loggedIn, username, userId, teamData })
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
    
})

// create a team in the database and assign an owner to the team
router.post('/team', (req, res) => {
    req.body.owner = req.session.userId
    const team = {
        idAPI: req.body.id, 
        name: req.body.name, 
        city: req.body.city, 
        owner: req.body.owner
    }
    console.log('this is req.body from tracker/team', req.body)
    Team.create(team)
        .then(() => {
            res.redirect('team/myteam') 
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete a player in the database
router.post('/player/delete', (req, res) => {
    const player = {idAPI: req.body.id}
    console.log('this is player ID', player)
    Player.deleteOne(player)
        .then(() => {
            res.redirect('myplayer')
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete a team in the database
router.post('/team/delete', (req, res) => {
    const team = {idAPI: req.body.id}
    console.log('this is team ID', team)
    Team.deleteOne(team)
        .then(() => {
            res.redirect('myteam')
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// tracker main page.
router.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('tracker/home', { loggedIn, username, userId })
})

module.exports = router