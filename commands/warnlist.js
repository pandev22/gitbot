const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'warnlist',
  execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('Vous n\'avez pas la permission de voir les warns.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Veuillez mentionner l\'utilisateur dont vous souhaitez voir les warns.');
    }

    fs.readFile('./assets/warn.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return message.reply('Une erreur s\'est produite lors de la lecture des warns.');
      }

      const warns = JSON.parse(data);

      if (!warns[user.id]) {
        return message.reply('Cet utilisateur n\'a aucun warn.');
      }

      const userWarns = warns[user.id];

      const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`Warns de ${user.tag}`)
        .setDescription(`Voici les warns de l'utilisateur ${user} :`)
        .setTimestamp();

      for (const warn of userWarns) {
        const { reason, timestamp } = warn;
        embed.addField('Raison', reason);
        embed.addField('Date', new Date(timestamp).toLocaleString('fr-FR'));
      }

      message.channel.send(embed);
    });
  }
};
