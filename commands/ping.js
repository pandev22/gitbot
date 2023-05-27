const Discord = require('discord.js');

module.exports = {
  name: 'ping',
  execute(message, args) {
    const pingEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Ping du Bot')
      .addField('Ping', `${Math.round(message.client.ws.ping)} ms`)
      .setTimestamp()
      .setFooter('Ping');

    message.channel.send(pingEmbed);
  }
};
