const { Schema, model } = require('./connection.js')
const User = require('./user')

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
    fieldGoalPercentage: {
        type: Number
    },
    owner: {
        type: Schema.Types.ObjectID,
		ref: 'User',
    }
},
{ timestamps: true }
)

const Player = model('Player', PlayerSchema)

module.exports = Player