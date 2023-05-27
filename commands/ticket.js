const Discord = require('discord.js');

const ticketUsers = new Discord.Collection();

module.exports = {
  name: 'ticket',
  execute(message, args) {
    if (ticketUsers.has(message.author.id)) {
      return message.reply('Vous avez déjà un ticket en cours. Veuillez le fermer avant d\'en créer un nouveau.');
    }

    const category = message.guild.channels.cache.find(channel => channel.name === 'Tickets' && channel.type === 'category');
    if (!category) {
      return message.reply('La catégorie "Tickets" n\'existe pas sur ce serveur.');
    }

    message.guild.channels.create(`ticket-${message.author.id}`, {
      type: 'text',
      parent: category.id,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL']
        },
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL']
        }
      ]
    })
      .then(ticketChannel => {
        ticketUsers.set(message.author.id, ticketChannel.id);

        const ticketEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Ticket de support')
          .setDescription(`Un ticket de support a été créé pour ${message.author}.`)
          .addField('ID du Ticket', ticketChannel.id)
          .addField('Créateur', message.author.tag)
          .setTimestamp()
          .setFooter('Ticket');

        ticketChannel.send(ticketEmbed).then(ticketMsg => {
          ticketMsg.react('🔒');

          const filter = (reaction, user) => reaction.emoji.name === '🔒' && user.id === message.author.id;

          const collector = ticketMsg.createReactionCollector(filter, { max: 1, time: 60000 });

          collector.on('collect', () => {
            ticketChannel.messages.fetch({ limit: 100 })
              .then(messages => {
                const conversation = messages.array().reverse().map(m => `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}`).join('\n');
                
                const conversationEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setTitle('Conversation du ticket')
                  .setDescription(`Voici la conversation de votre ticket ${ticketChannel}:`)
                  .addField('Conversation', conversation)
                  .setTimestamp()
                  .setFooter('Ticket');
                
                message.author.send(conversationEmbed)
                  .catch(console.error);
              })
              .catch(console.error);

            const closeEmbed = new Discord.MessageEmbed()
              .setColor('#ff0000')
              .setTitle('Ticket fermé')
              .setDescription(`Le ticket ${ticketChannel} a été fermé par ${message.author}.`)
              .setTimestamp()
              .setFooter('Ticket');

            ticketChannel.send(closeEmbed);

            message.reply('Votre ticket a été fermé.');

            ticketChannel.delete();
            ticketUsers.delete(message.author.id);

            collector.stop();
          });

          collector.on('end', () => {
            if (!ticketMsg.deleted) {
              ticketMsg.reactions.cache.get('🔒').remove();
            }
          });
        });

        const userEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Ticket de support')
          .setDescription(`Votre ticket de support a été créé dans ${ticketChannel}.`)
          .addField('ID du Ticket', ticketChannel.id)
          .addField('Créateur', message.author.tag)
          .setTimestamp()
          .setFooter('Ticket');

        message.author.send(userEmbed)
          .catch(console.error);
      })
      .catch(error => {
        console.error(error);
        message.reply('Une erreur s\'est produite lors de la création du ticket.');
      });
  }
};
