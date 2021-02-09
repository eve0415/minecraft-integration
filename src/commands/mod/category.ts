import { curseforge } from 'aio-mc-api';
import { Message, MessageEmbed } from 'discord.js';
import { DJSClient } from '../..';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    public constructor(client: DJSClient) {
        super(client, 'category', 'mod', { alias: ['cat'] });
    }

    public async run(message: Message): Promise<void | Message> {
        const mes = await message.channel.send({ embed: { description: 'Listing...\nIt might take some time' } });
        const categories = await curseforge.getSectionCategoryList(6);
        const embed = new MessageEmbed()
            .setTitle('Category List for Section Mod(6)')
            .addFields(categories.map(c => ({ name: c.name, value: c.id, inline: true })))
            .setColor('BLUE');
        mes.edit(embed);
    }
}
