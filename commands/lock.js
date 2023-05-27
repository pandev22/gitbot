const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'lock',
  execute(message, args) {
    // Vérification de l'autorisation pour gérer les canaux
    if (!message.member.hasPermission(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.channel.send('Vous n\'avez pas la permission de verrouiller des canaux.');
    }

    // Vérification si le canal est déjà verrouillé
    const channel = message.channel;
    const channelPermissions = channel.permissionOverwrites.get(channel.guild.roles.everyone.id);

    if (!channelPermissions || channelPermissions.deny.has(Permissions.FLAGS.SEND_MESSAGES)) {
      // Le canal est déjà verrouillé
      return message.channel.send('Ce canal est déjà verrouillé.');
    }

    // Verrouillage du canal en désactivant l'envoi de messages
    channel.updateOverwrite(channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    })
      .then(() => {
        // Création de l'embed pour afficher le message de verrouillage
        const embed = new MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Canal verrouillé')
          .setDescription('Ce canal est maintenant verrouillé. Seuls les utilisateurs avec les permissions appropriées peuvent envoyer des messages.');

        // Envoi de l'embed dans le canal
        message.channel.send(embed);
      })
      .catch((error) => {
        console.error('Erreur lors du verrouillage du canal :', error);
        message.channel.send('Une erreur s\'est produite lors du verrouillage du canal.');
      });
  }
};