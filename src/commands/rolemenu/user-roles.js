const { MessageEmbed, Message } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("List your own roles")
        .addSubcommand(subcommand =>
            subcommand
            .setName("member")
            .setDescription("List roles of the member mentioned")
            .addUserOption(option => option.setName("target").setDescription("The member mentioned"))),
    
    async execute(interaction) {
        if(interaction.options.getSubcommand() === "member") {
            const user = interaction.options.getUser("target");
            const member = interaction.options.getMember("target");
            if(member) {

                const filteredRoles = member.roles.cache.filter(role => role.id != interaction.guild.id);
                const listedRoles = filteredRoles.sort((a, b) => b.position - a.position).map(role => role.toString());

                await interaction.reply({embeds: [
                    new MessageEmbed()
                        .setTitle(`Roles of ${user.username}`)
                        .addField("Roles", listedRoles.join(", "))
                ]})
            }else {
                const filteredRoles = interaction.member.roles.cache.filter(role => role.id != interaction.guild.id);
                const listedRoles = filteredRoles.sort((a, b) => b.position - a.position).map(role => role.toString());

                await interaction.reply({embeds: [
                    new MessageEmbed()
                        .setTitle(`Roles of ${interaction.user.username}`)
                        .addField("Roles", listedRoles.join(", "))
                ]})
            }
        }
    }
};