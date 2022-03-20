const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "close",
    description: "Close a ticket.",
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close a ticket.')
        .addStringOption(str =>
            str.setName("id")
                .setDescription("The custom ID of the ticket (found in the ticket name). E.g: 8274")
                .setRequired(true)
        ),
    run: async (client, interaction) => {

        /* Send working message */
        await interaction.deferReply({ ephemeral: true })

        /* Check if they inputted an id */
        let ticketid = interaction.options.getString("id")

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
        c.permissionOverwrites.edit(u, { VIEW_CHANNEL: false })
        c.edit({ name: `closed-${ticket.ticketID}`, topic: `Status: Closed` })
        
        /* Update the status in the db */
        await ticket.updateOne({
            status: "Closed"
        })

        /* Closed embed */
        let closed = new Discord.MessageEmbed()
            .setDescription("This ticket is now closed.")
            .setColor("RED")

        /* Send closed embed */
        interaction.guild.channels.cache.get(ticket.channelID).send({ embeds: [closed] })

        /* Send success message */
        interaction.followUp({ content: "Successfully closed the ticket.", ephemeral: true })

    }
}