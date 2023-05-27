const Discord = require('discord.js');

module.exports = {
  name: 'userinfo',
  execute(message, args) {
    const user = message.mentions.users.first() || message.author;

    const userInfoEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Informations de l\'Utilisateur')
      .setDescription(`Voici quelques informations sur l'utilisateur **${user.username}** :`)
      .addField('Nom d\'utilisateur', user.username)
      .addField('ID', user.id)
      .addField('Statut', user.presence.status)
      .addField('Rejoint le serveur', message.guild.member(user).joinedAt)
      .setThumbnail(user.avatarURL())
      .setTimestamp()
      .setFooter('UserInfo');

    message.channel.send(userInfoEmbed);
  }
};