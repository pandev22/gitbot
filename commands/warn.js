const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'warn',
  execute(message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.');

      return message.channel.send(embed);
    }

    const user = message.mentions.users.first();
    if (!user) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Veuillez mentionner un utilisateur à avertir.');

      return message.channel.send(embed);
    }

    const reason = args.slice(1).join(' ');
    if (!reason) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Veuillez fournir une raison pour l\'avertissement.');

      return message.channel.send(embed);
    }

    const warning = {
      user: user.id,
      reason,
      timestamp: new Date().toISOString()
    };

    fs.readFile('./assets/warn.json', (err, data) => {
      if (err) {
        console.error("Une erreur s'est produite lors de la lecture du fichier des avertissements:", err);
        return;
      }

      const warnings = JSON.parse(data);

      if (!warnings[user.id]) {
        warnings[user.id] = [];
      }

      warnings[user.id].push(warning);

      fs.writeFile('./assets/warn.json', JSON.stringify(warnings, null, 2), err => {
        if (err) {
          console.error("Une erreur s'est produite lors de l'écriture du fichier des avertissements:", err);
          return;
        }

        const embed = new Discord.MessageEmbed()
          .setColor('#ff4655')
          .setTimestamp()
          .setDescription(`L'utilisateur ${user.tag} a été averti pour la raison suivante : ${reason}`);

        message.channel.send(embed);

        if (warnings[user.id].length >= 3) {
          const member = message.guild.members.cache.get(user.id);
          if (member) {
            member.ban({ reason: 'Trois avertissements' })
              .catch(err => {
                console.error("Une erreur s'est produite lors du bannissement de l'utilisateur :", err);
              });
          }
        }
      });
    });
  },
};