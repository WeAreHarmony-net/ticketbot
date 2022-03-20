const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "delete",
    description: "Delete a ticket.",
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a ticket.'),
    run: async (client, interaction) => {

        /* Send working message */
        await interaction.deferReply({ ephemeral: true })

        /* Check if they inputted an id */
        let ticketid = interaction.channel.name.replace("closed-", "")
        if (!interaction.channel.name.includes("closed-")) return interaction.followUp({ content: "This must be used in a ticket.", ephemeral: true })

        /* Check for the ticket */
        let ticket = await db.models.Tickets.findOne({
            ticketID: ticketid
        })

        /* Fetch guild configurations */
        let config = await db.models.Config.findOne({
            openTickets: ticketid
        })

        /* If ticket doesn't exist, show error message */
        if (!ticket) return interaction.followUp({ content: "This ticket does not exist or the ticket was not closed first.", ephemeral: true })

        /* Fetch user from guild */
        let u = await interaction.guild.members.fetch(ticket.userID)

        /* Edit the channel */
        let c = await interaction.guild.channels.cache.get(ticket.channelID)
        c.edit({ name: `delete-${ticket.ticketID}`, topic: `Status: Deleting` })

        /* Pull it out from the config */
        await config.updateOne(
            { $pull: { openTickets: ticket.ticketID } }
        )

        /* Delete the ticket */
        await ticket.delete()

        /* Deleting embed */
        let deleting = new Discord.MessageEmbed()
            .setDescription("This ticket is being deleted in 10s.")
            .setColor("RED")

        /* Send deleting embed */
        interaction.guild.channels.cache.get(ticket.channelID).send({ embeds: [deleting] })

        /* Send success message */
        interaction.followUp({ content: "Deleting the ticket.", ephemeral: true })

        /* Get all messages in the channel */
        let messages = []
        c.messages.cache.forEach(message => {
            if (parseInt(message.embeds.length) > 0) return messages.push(message.author.tag + ": [Discord Embed]")
            messages.push(message.author.tag + ": " + message.content)
        })

        /* Write file */
        fs.writeFileSync(`${__dirname.replace("\\cmds", "")}/transcripts/${c.id}.txt`, `${messages.join("\n")}`)

        /* Set an interval to remove the channel */
        setTimeout(() => {
            c.delete()
        }, 10000);

    }
}