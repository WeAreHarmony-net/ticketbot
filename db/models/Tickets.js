const mongoose = require('mongoose')

const t = mongoose.Schema({
    userID: String,
    ticketID: String,
    status: String
})

module.exports = mongoose.model('ticket', t, 'tickets')