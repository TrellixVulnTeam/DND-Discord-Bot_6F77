const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins your voice channel"),
    async run(interaction) {
        const { voice } = interaction.member;
        if (!voice.channelId) {
            interaction.reply("You must be in a voice channel.");
            return;
        }else {
           joinVoiceChannel({
               channelId: interaction.member.voice.channel.id,
               guildId: interaction.guild.id,
               adapterCreator: interaction.guild.voiceAdapterCreator,
               selfDeaf: false
           });
           interaction.reply("わかりました! (Got it!)");
           return;
        }
    } 
};