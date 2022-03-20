const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "tickettype",

    run: async (client, interaction) => {

        /* Fetch the custom ID from the values sent */
        let customID = interaction.values[0]

        /* Find config file from customID */
        let config = await db.models.Config.findOne({
            customID: customID.replace("openTicket-", "")
        })

        /* If for some reason the custom ID is not there, send error message */
        if (!config) return interaction.update({ content: "Sorry, there has been an issue with fetching the custom ID.", embeds: [], components: [], ephemeral: true })

        /* Create a custom ID for the ticket */
        let rand = db.functions.randomCode()

        /* Create the Discord Channel */
        let channel = interaction.guild.channels.create(`ticket-${rand}`, {
            type: "GUILD_TEXT",
            parent: config.categoryID,
            topic: "Status: Open",
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: config.roleID,
                    allow: [Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: client.user.id,
                    allow: [Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.MANAGE_CHANNELS]
                },
            ]
        }).catch(err => {
            /* Check if there was an error creating the channel */
            if (err) return interaction.update({ content: "Sorry, there was an issue while creating the channel. This may be because the ticket handler role is higher than the bot.", embeds: [], components: [], ephemeral: true })
        }).then(async (channel) => {

            /* Create a new ticket in the db */
            let tdb = await new db.models.Tickets({
                userID: interaction.user.id,
                ticketID: rand,
                status: "Open",
                channelID: channel.id
            }).save()

            /* Update config openTickets */
            await config.updateOne(
                { $push: { openTickets: rand } }
            )

            /* Update message to success */
            await interaction.update({ content: `Created the ticket. <#${channel.id}>`, embeds: [], components: [], ephemeral: true })

            /* Send message to channel */
            channel.send({ content: `Welcome, <@${interaction.user.id}>.\nThe <@&${config.roleID}> team will be with you shortly.` })

        })

    }
}