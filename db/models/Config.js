const mongoose = require('mongoose')

const t = mongoose.Schema({
    guildID: String,
    categoryID: String,
    openTickets: Array,
    ticketOptions: Array,
    customID: String,
    roleID: String
})

module.exports = mongoose.model('conf', t, 'config')