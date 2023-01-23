const { Schema, model } = require('./connection.js')

const PlayerSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    points: {
        type: Number
    },
    rebounds: {
        type: Number
    },
    assists: {
        type: Number
    },
    owner: {
        type: Schema.Types.ObjectID,
		ref: 'User',
    }
})

const Player = model('Player', PlayerSchema)

module.exports = Player