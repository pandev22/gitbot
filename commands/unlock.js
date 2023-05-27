const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'unlock',
  execute(message, args) {
    if (!message.member.hasPermission(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.channel.send('Vous n\'avez pas la permission de déverrouiller des canaux.');
    }

    const channel = message.channel;
    const channelPermissions = channel.permissionOverwrites.get(channel.guild.roles.everyone.id);

    if (!channelPermissions || !channelPermissions.deny.has(Permissions.FLAGS.SEND_MESSAGES)) {
      return message.channel.send('Ce canal est déjà déverrouillé.');
    }

    channel.updateOverwrite(channel.guild.roles.everyone, {
      SEND_MESSAGES: null
    })
      .then(() => {
        const embed = new MessageEmbed()
          .setColor('#00FF00')
          .setTitle('Canal déverrouillé')
          .setDescription('Ce canal est maintenant déverrouillé. Les utilisateurs peuvent à nouveau envoyer des messages.');

        message.channel.send(embed);
      })
      .catch((error) => {
        console.error('Erreur lors du déverrouillage du canal :', error);
        message.channel.send('Une erreur s\'est produite lors du déverrouillage du canal.');
      });
  }
};