const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require('discord.js');
const sqlite = require("sqlite3").verbose();
// Open Database connection
let database = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("whisperr")
    .setDescription("Whisper to another Adventurer")
    .addUserOption(option => option.setName("adventurer")
        .setDescription("The recipient of the whisper"))
    .addStringOption(option => option.setName("message")
        .setDescription("Your message")),
    async execute(interaction) {
        let recipient = interaction.options.getUser("adventurer");
        let message = interaction.options.getString("message");
        if(recipient && recipient != interaction.member.user) { 

            let createChannel = function createChannel(){
                // ADD VARIABLE CAMPAIGN
                let campaignname = "ghost of saltmarsh"
                interaction.guild.channels.create(`${interaction.member.user.username}-${recipient.username}-${campaignname}`, {
                    type: 'GUILD_TEXT',
                }).then((channel => {
                    const categoryId = '984140536145379370'
                    channel.setParent(categoryId);
                    // ADD DM PERMISSIONS
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
                    ]);
                    
                    channel.send(`Hey ${recipient}! ${interaction.member.user} sent you a whisper containing: "` + message + `"`);

                    interaction.reply({
                        content: 'Whisper: "' + message +  `" has been sent to ${recipient.username}`,
                        ephemeral: true
                    });    
    
                    let query = `SELECT * FROM whisperrelation WHERE userid1 = ? AND userid2 = ?`;
                    database.get(query, [interaction.member.user.id, recipient.id], (err, row) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    if (row === undefined) {
                        // if Database Entry doesn't exist, create one and insert data according to users
                        database.run("INSERT INTO whisperrelation VALUES($channelid, $userid1, $userid2)", {
                            $channelid: channel.id,
                            $userid1: interaction.member.user.id,
                            $userid2: recipient.id
                        });
                        return;
                    } else {
                        let userid1 = row.userid1;
                        let userid2 = row.userid2;
                        let channelid = row.channelid;
                        console.log(channelid, userid1, userid2);
                    }
                    });
                        
                }));
            };
            let channelExists = function channelExists(){
                let query = `SELECT channelid FROM whisperrelation WHERE userid1 = ? AND userid2 = ? OR userid1 = ? AND userid2 = ?`;
                database.get(query, [interaction.member.user.id, recipient.id, recipient.id, interaction.member.user.id], (err, row) => {
                    if(err) {
                        console.log(err.message);
                        return
                    } else {
                        let channel = interaction.guild.channels.cache.find(channel => 
                            channel.id === row.channelid);
                        channel.send(`Hey ${interaction.member.user}, you already have a whisper with ${recipient.username}`);
                        interaction.reply({
                            content: `Redirect to: <#${channel.id}>`,
                            ephemeral: true
                        });
                        return;
                    }
                });
            };

            let query = `SELECT channelid FROM whisperrelation WHERE userid1 = ? AND userid2 = ? OR userid1 = ? AND userid2 = ?`;
            database.get(query, [interaction.member.user.id, recipient.id, recipient.id, interaction.member.user.id], (err, row) => {
                if(err) {
                    console.log(err.message);
                    return
                }
                if(row === undefined){
                    createChannel();
                } else {
                    channelExists();
                }
            });
        } else {
            interaction.reply({
                content: "You can't whisper to yourself!",
                ephemeral: true
            });
            return;
        }
    }
}