const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects from your voice channel"),
    async run(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if(!connection) {
            return interaction.reply("I'm not connected to any channel.");
        }else {
            connection.destroy();
            interaction.reply("Leaving!");
            return;
        }
    } 
};