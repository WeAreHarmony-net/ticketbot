const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "reopen",
    description: "Reopen a ticket.",
    data: new SlashCommandBuilder()
        .setName('reopen')
        .setDescription('Reopen a ticket.')
        .addStringOption(str =>
            str.setName("id")
                .setDescription("The custom ID of the ticket (found in the ticket name). E.g: 8274")
                .setRequired(false)
        ),
    run: async (client, interaction) => {

        /* Send working message */
        await interaction.deferReply({ ephemeral: true })

        /* Check if they inputted an id */
        let ticketid = interaction.options.getString("id") || interaction.channel.name.replace("closed-", "")

        /* Check for the ticket */
        let ticket = await db.models.Tickets.findOne({
            ticketID: ticketid
        })

        /* Fetch guild configurations */
        let config = await db.models.Config.find({
            guildID: interaction.guild.id
        })

        /* If ticket doesn't exist, show error message */
        if (!ticket) return interaction.followUp({ content: "This ticket does not exist.", ephemeral: true })

        /* Fetch user from guild */
        let u = await interaction.guild.members.fetch(ticket.userID)

        /* Edit the channel */
        let c = await interaction.guild.channels.cache.get(ticket.channelID)
        c.edit({ name: `ticket-${ticket.ticketID}`, topic: `Status: Open` })
        c.permissionOverwrites.create(u, { VIEW_CHANNEL: true, SEND_MESSAGES: true })

        /* Update the status in the db */
        await ticket.updateOne({
            status: "Open"
        })

        /* Open embed */
        let open = new Discord.MessageEmbed()
            .setDescription("This ticket is now open.")
            .setColor("GREEN")

        /* Send open embed */
        interaction.guild.channels.cache.get(ticket.channelID).send({ embeds: [open] })

        /* Send success message */
        interaction.followUp({ content: "Successfully reopened the ticket.", ephemeral: true })

    }
}