const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const db = require("../db/index")

module.exports = {
    command: "setup",
    description: "Setup Ticketing.",
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup Ticketing.')
        .addChannelOption(chn =>
            chn.setName("category")
                .setDescription("The category where the tickets should go.")
                .setRequired(true)
        )
        .addStringOption(str => 
            str.setName("title")
                .setDescription("What your ticket aims to do. E.g: Support.")
                .setRequired(true)
        )
        .addStringOption(str => 
            str.setName("description")
                .setDescription("Explain what it will do. E.g: Get help from our staff team!")
                .setRequired(true)
        )
        .addRoleOption(role =>
            role.setName("role")
                .setDescription("The ticket handler role.")
                .setRequired(true)
        ),
    run: async (client, interaction) => {

        /* All inputs from the user */
        let category = interaction.options.getChannel("category")
        let title = interaction.options.getString("title")
        let description = interaction.options.getString("description")
        let role = interaction.options.getRole("role")

        /* Send working message */
        await interaction.deferReply({ ephemeral: true })

        /* Check if the category input was not an actual category */
        if (category.type !== "GUILD_CATEGORY") return interaction.followUp({ content: "Sorry, the category must not be a text channel, voice channel or anything else.", ephemeral: true })

        /* Create a custom ID for the config */
        let rand = db.functions.randomCode()

        /* Create the configurations in the db */
        await new db.models.Config({
            guildID: interaction.guild.id,
            categoryID: category.id,
            openTickets: [],
            customID: rand,
            roleID: role.id,
            ticketOptions: [
                {
                    type: "title",
                    value: title
                },
                {
                    type: "description",
                    value: description
                }
            ]
        }).save()

        /* Show success embed */
        let embed = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setDescription("The ticket option has been created.")
            .addField("Title", title)
            .addField("Description", description)
            .addField("Category ID", category.id)
            .addField("Custom ID", rand)
            .setColor("GREEN")

        /* Send the embed */
        interaction.followUp({ embeds: [embed], ephemeral: true })

    }
}