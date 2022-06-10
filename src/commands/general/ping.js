const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("test").setDescription("Pong!"),
    async execute(interaction) {

		const member = interaction.member;
		const filteredRoles = member.roles.cache.filter(role => role.id != interaction.guild.id);
		const listedRoles = filteredRoles.sort((a, b) => b.position - a.position).map(role => role.name.toString());
		const valueIDRoles = filteredRoles.sort((a, b) => b.position - a.position).map(role => role.id.toString());

		const ArrayTest = Array.from(listedRoles);
		
		const SelectMenu = new MessageSelectMenu();

		for(let index = 0 ; index < ArrayTest.length; ++index) {
			const Element = ArrayTest[index];
			const Value = valueIDRoles[index];
			SelectMenu.addOptions([
				{
					label: Element,
					description: 'Test',
					value: Value
				}
			])
		}

        const row = new MessageActionRow()
			.addComponents(
				SelectMenu
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
			);

        await interaction.reply({ content: 'Pong!', components: [row] });
    } 
}

