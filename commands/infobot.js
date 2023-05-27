const Discord = require('discord.js');

module.exports = {
  name: 'botinfo',
  execute(message, args) {
    const botInfoEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Informations du Bot')
      .setDescription('Voici quelques informations sur le bot :')
      .addField('Nom', message.client.user.username)
      .addField('Version Discord.js', Discord.version)
      .addField('Serveurs', message.client.guilds.cache.size)
      .addField('Utilisateurs', message.client.users.cache.size)
      .addField('Ping', `${message.client.ws.ping} ms`)
      .setTimestamp()
      .setFooter('BotInfo');

    message.channel.send(botInfoEmbed);
  }
};