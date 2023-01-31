const { Schema, model } = require('./connection.js')
const User = require('./user')

const PlayerSchema = new Schema ({
    lastName: {
        type: String,
    },
    firstName: {
        type: String
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

const Player = model('Player', PlayerSchema)

module.exports = Player