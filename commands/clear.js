const Discord = require('discord.js');

module.exports = {
  name: 'clear',
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Vous n\'avez pas la permission d\'utiliser cette commande.');

      return message.channel.send(embed);
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0 || amount > 100) {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff4655')
        .setDescription('Veuillez spécifier un nombre valide de messages à supprimer (1-100).');

      return message.channel.send(embed);
    }

    message.channel.bulkDelete(amount + 1)
      .then(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#ff4655')
          .setDescription(`J'ai supprimé ${amount} messages.`);

        message.channel.send(embed)
          .then(msg => {
            msg.delete({ timeout: 5000 });
          });
      })
      .catch(err => {
        console.error("Une erreur s'est produite lors de la suppression des messages :", err);

        const embed = new Discord.MessageEmbed()
          .setColor('#ff4655')
          .setDescription('Une erreur s\'est produite lors de la suppression des messages.');

        message.channel.send(embed);
      });
  },
};
