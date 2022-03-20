/* 
DO NOT TOUCH ANYTHING IN HERE UNLESS YOU KNOW WHAT YOU ARE DOING 

██████╗░░█████╗░███╗░░██╗████████╗  ████████╗░█████╗░██╗░░░██╗░█████╗░██╗░░██╗
██╔══██╗██╔══██╗████╗░██║╚══██╔══╝  ╚══██╔══╝██╔══██╗██║░░░██║██╔══██╗██║░░██║
██║░░██║██║░░██║██╔██╗██║░░░██║░░░  ░░░██║░░░██║░░██║██║░░░██║██║░░╚═╝███████║
██║░░██║██║░░██║██║╚████║░░░██║░░░  ░░░██║░░░██║░░██║██║░░░██║██║░░██╗██╔══██║
██████╔╝╚█████╔╝██║░╚███║░░░██║░░░  ░░░██║░░░╚█████╔╝╚██████╔╝╚█████╔╝██║░░██║
╚═════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░  ░░░╚═╝░░░░╚════╝░░╚═════╝░░╚════╝░╚═╝░░╚═╝
*/

require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_INTEGRATIONS'] })
const modals = require("discord-modal")(client)
const fs = require("fs")
const db = require("./db/index")
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

let alldata = []

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    client.commands.set(command.data.name, command);
    let d = JSON.stringify(command.data).replace("W ", "")
    alldata.push(JSON.parse(d))
}

db.functions.connect().then((connected) => { if (connected) console.log("DB | Connected") })

client.on("ready", () => {
    console.log("DISCORD | " + client.user.tag)
    client.user.setPresence({ activities: [{ name: "/ticket to open a ticket!" }] })
    client.guilds.cache.forEach(guild => guild.commands.set(alldata))
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        fs.readdir(__dirname + "/cmds", (err, files) => {
            files.forEach(async (file) => {
                const loaded = require("./cmds/" + file)
                if (loaded.command === interaction.commandName) return loaded.run(client, interaction)
            })
        })
    }
    if (interaction.isSelectMenu()) {
        fs.readdir(__dirname + "/selectMenu", (err, files) => {
            files.forEach(async (file) => {
                const loaded = require("./selectMenu/" + file)
                if (loaded.command.includes(interaction.customId)) return loaded.run(client, interaction)
            })
        })
    }
})

client.login(process.env.TOKEN)