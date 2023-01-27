const { Schema, model } = require('./connection.js')
const User = require('./user')

const TeamSchema = new Schema ({
    name: {
    },
    city: {
    },
    idAPI: {
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


