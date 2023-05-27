const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
  
    setRandomStatus();
  
    setInterval(() => {
      setRandomStatus();
    }, 30000);
});

function setRandomStatus() {
    const randomStatus = config.statuses[Math.floor(Math.random() * config.statuses.length)];
    client.user.setActivity(randomStatus.name, { type: randomStatus.type });
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande.');
  }
});

client.login(token);
