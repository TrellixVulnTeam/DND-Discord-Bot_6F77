const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Returns info based on input')
    .addSubcommand(subcommand =>
        subcommand
        .setName("user")
        .setDescription("Gets information of a user mentioned")
        .addUserOption(option => option.setName("target").setDescription("The user mentioned")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription("Info about the server")),
    async execute(interaction) {
        if(interaction.options.getSubcommand() === "user") {
            const user = interaction.options.getUser("target");
            if(user) {
                await interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(`Information about ${user.username}`)
                    .addFields([
                        {
                            name: "Name and Discriminator",
                            value: `${user.username}#${user.discriminator}`
                        },
                        {
                            name: "ID:",
                            value: `${user.id}`
                        }
                    ])
                ]})
            }else {
                // await interaction.reply(`Username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
                await interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(`Information about yourself`)
                    .addFields([
                        {
                            name: "Name and Discriminator",
                            value: `${user.username}#${user.discriminator}`
                        },
                        {
                            name: "ID:",
                            value: `${user.id}`
                        }
                    ])
                ]})
            }
        } else if (interaction.options.getSubcommand() === "server") {
            // await interaction.reply(`Server Name: ${interaction.guild.name}\nTotal Members: ${interaction.guild.memberCount}`);
            await interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(`Information about ${interaction.guild.name}`)
                .addFields([
                    {
                        name: "Guild ID:",
                        value: `${interaction.guild.id}`
                    }
                ])
            ]})
        }
    } 
};