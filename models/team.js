const { Schema, model } = require('./connection.js')
const User = require('./user')

const TeamSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    pointsFor: {
        type: Number
    },
    pointsAgainst: {
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

const Team = model('Team', TeamSchema)

module.exports = Team