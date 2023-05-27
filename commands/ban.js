const Discord = require('discord.js');

module.exports = {
  name: 'ban',
  execute(message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Veuillez mentionner l\'utilisateur à bannir.');
    }

    const reason = args.slice(1).join(' ');
    if (!reason) {
      return message.reply('Veuillez spécifier une raison pour le bannissement.');
    }

    message.guild.members.ban(user, { reason: reason })
      .then(() => {
        const banEmbed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Bannissement')
          .addField('Utilisateur', user.tag)
          .addField('Modérateur', message.author.tag)
          .addField('Raison', reason)
          .setTimestamp()
          .setFooter('Ban');

        message.channel.send(banEmbed);
      })
      .catch(error => {
        console.error(error);
        message.reply('Une erreur s\'est produite lors du bannissement de l\'utilisateur.');
      });
  }
};