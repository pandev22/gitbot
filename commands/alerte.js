const Discord = require('discord.js');

module.exports = {
  name: 'alerte',
  execute(message, args) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('Vous n\'avez pas la permission d\'envoyer une alerte.');
    }

    const alertContent = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Alerte')
      .setDescription(alertContent)
      .setTimestamp()
      .setThumbnail('https://i.imgur.com/KYrpeCa.png')
      .setFooter('Message d\'alerte');

    message.guild.members.cache.forEach(member => {
      if (member.user.bot) return;
      member.send(embed)
        .catch(error => {
          console.error(`Impossible d'envoyer un message d'alerte à l'utilisateur ${member.user.tag}:`, error);
        });
    });

    message.channel.send('Message d\'alerte envoyé à tous les utilisateurs.');
  }
};
