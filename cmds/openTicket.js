const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "ticket",
    description: "Open a ticket.",
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Open a ticket.'),
    run: async (client, interaction) => {
        
        /* Send working message */
        await interaction.deferReply({ ephemeral: true })

        /* The silly way of saying: "ticketOptions" */
        let dontwantnoscrubs = []

        /* Fetch guild configurations */
        let conf = await db.models.Config.find({
            guildID: interaction.guild.id
        })

        /* If configurations don't exist, send error message */
        if (conf.length == "0") return interaction.followUp({ content: "Sorry, this server has not yet been setup with this bot.", ephemeral: true })

        /* Cycle through the ticket types */
        conf.forEach(configFile => {
            /* All var statements */
            var title = "";
            var description = "";

            /* Go through the ticketOptions array */
            configFile.ticketOptions.forEach(ticketOption => {
                /* Check the ticketOption type and change the var statements */
                if (ticketOption.type == "title") title = ticketOption.value;
                if (ticketOption.type == "description") description = ticketOption.value;
            })

            /* Push the ticket type into the array with the format of a normal dropdown option */
            dontwantnoscrubs.push({
                label: title,
                description: description,
                value: `openTicket-${configFile.customID}`
            })
        })

        /* The embed that will be sent with the dropdown menu */
        let embed = new Discord.MessageEmbed()
            .setDescription("Please select the topic below.")
            .setColor("BLURPLE")

        /* The Dropdown Menu */
        let dropdown = new Discord.MessageSelectMenu()
            .setCustomId("tickettype")
            .setPlaceholder("Please select a topic...")
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions(dontwantnoscrubs)
        
        /* Create a componenent row */
        let row = new Discord.MessageActionRow()
            .addComponents([dropdown])

        /* Send the dropdown menu with the embed made */
        interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })

    }
}