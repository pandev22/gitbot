const Discord = require('discord.js');

module.exports = {
  name: 'serverinfo',
  execute(message, args) {
    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Informations du Serveur')
      .setDescription('Voici quelques informations sur ce serveur :')
      .addField('Nom du Serveur', message.guild.name)
      .addField('ID du Serveur', message.guild.id)
      .addField('Région', message.guild.region)
      .addField('Membres', message.guild.memberCount)
      .addField('Propriétaire', message.guild.owner.user.tag)
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setFooter('ServerInfo');

    message.channel.send(serverInfoEmbed);
  }
};
