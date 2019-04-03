require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require("enmap");
const guildSql = require('./sqlite/guildSql');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.sql = new guildSql(); // Singleton of GuildSql inside the Client object
client.cooldowns = new Discord.Collection();

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => { // eventHandler
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, arg => eventHandler(client, arg))
  })
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('error', console.error); // in case of random occurring hard to reproduce error. I.e. ECONERROR

client.login(process.env.BOT_TOKEN)