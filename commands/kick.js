const Discord = require('discord.js');

module.exports = {
  name: 'kick',
  execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.');

      return message.channel.send(embed);
    }

    const user = message.mentions.users.first();
    if (!user) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Veuillez mentionner un utilisateur à expulser.');

      return message.channel.send(embed);
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Cet utilisateur n\'est pas membre du serveur.');

      return message.channel.send(embed);
    }

    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

    member.kick(reason)
      .then(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#ff4655')
          .setDescription(`L'utilisateur ${user.tag} a été expulsé avec succès pour la raison suivante : ${reason}`);

        message.channel.send(embed);
      })
      .catch(err => {
        console.error("Une erreur s'est produite lors de l'expulsion de l'utilisateur :", err);

        const embed = new Discord.MessageEmbed()
          .setColor('#ff4655')
          .setDescription('Une erreur s\'est produite lors de l\'expulsion de l\'utilisateur.');

        message.channel.send(embed);
      });
  },
};
