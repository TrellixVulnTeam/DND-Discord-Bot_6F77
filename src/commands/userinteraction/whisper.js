const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require('discord.js');

module.exports = {
    // creating the Slash Command
    data: new SlashCommandBuilder()
    .setName("whisperr")
    .setDescription("Whisper to another Adventurer")
    .addUserOption(option => option.setName("adventurer")
        .setDescription("The recipient of the whisper"))
    .addStringOption(option => option.setName("message")
        .setDescription("Your message")),
    async execute(interaction) {
        // setting the parameters for the functions
        let recipient = interaction.options.getUser("adventurer");
        let message = interaction.options.getString("message");
        if(recipient && recipient != interaction.member.user) {
            // replies to the interaction
        
            interaction.reply({
                content: 'Whisper: "' + message +  `" has been sent to ${recipient.username}`,
                ephemeral: true
                
            })
            // creates a text channel with permissions for everyone
            let campaignname = "ghost of saltmarsh"
            interaction.guild.channels.create(`${interaction.member.user.username}-${recipient.username}-${campaignname}`, {
                type: 'GUILD_TEXT',
            }).then((channel => {
                const categoryId = '984140536145379370'
                channel.setParent(categoryId);
                
                channel.permissionOverwrites.set([
                    {
                        id: channel.guild.roles.everyone.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: recipient.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: interaction.member.user.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    }
                ])

                 channel.send(`Hey ${recipient}! ${interaction.member.user} sent you a whisper containing: "` + message + `"`);
                    
            }));
        } else {
            interaction.reply({

            })
        }
    }
}