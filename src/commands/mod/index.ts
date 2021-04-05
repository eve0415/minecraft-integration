import { curseforge, SearchOptions, SimpleProject, SectionTypes, CategoryList, SectionAndCategoryResolvable } from 'aio-mc-api';
import { Message, MessageEmbed } from 'discord.js';
import { DJSClient, logger } from '../..';
import { SearchManager } from '../../managers';
import { Command } from '../../typings';

export default class extends Command {
    public constructor(client: DJSClient) {
        super(client, 'mod', {
            description: 'Search Minecraft mods',
            usage: 'mod <<string> [version | category] | category>',
            hasSubcom: true,
            usedInDM: true,
        });
    }

    public async run(message: Message, args: string[]): Promise<void | Message> {
        if (!args.length) return message.channel.send(this.usage);

        const mes = await message.channel.send({ embed: { description: 'Searching...\nIt might take some time' } });
        const option: Partial<SearchOptions> = {};

        const version = option.gameVersion = args.find(a => /^(\d+\.){1,2}\d+$/.test(a));
        args = args.filter(a => a !== version);

        const category = args.find(a => {
            if (Object.keys(SectionTypes).find(s => SectionTypes[s] === Number(a) || s === a)) return true;
            for (const [k, v] of Object.entries(CategoryList)) {
                if (k === a || v === Number(a)) return true;
            }
            return false;
        });
        option.category = category as SectionAndCategoryResolvable;
        args = args.filter(a => a !== category);

        const search = option.filter = args.find(a => a.includes(' ')) || args.find(a => a);
        args = args.filter(a => a !== search);

        if (args.length) {
            const embed = new MessageEmbed()
                .setTitle('Unknown keywords found.')
                .setDescription(`
                    Unknown keywords: **${args.join(', ')}** found.
                    
                    Suggestions:
                    - If you are using spaces to search multiple keywords use '""' around your words.
                    - Make sure that you are using the right category or section.
                    - Make sure that you are using the right game version.
                `)
                .setColor('RED');
            return mes.edit(embed);
        }

        const mods = await curseforge.searchProject(option) as SimpleProject[];
        if (!mods.length) {
            const embed = new MessageEmbed()
                .setTitle('No results containing all your search terms were found.')
                .setDescription(`
                    Suggestions:
                    - Make sure all words are spelled correctly.
                    - Try different keywords.
                    - Try more general keywords.
                    ${option.category ? '- Make sure that you are using the right category or section.' : ''}
                    ${option.gameVersion ? '- Make sure that you are using the right game version.' : ''}
                `)
                .setFooter(`Your search - "${option.filter} "${option.category ? `for category ${option.category} ` : ''} ${option.gameVersion ? `with version ${option.gameVersion} ` : ''}- did not much any projects`)
                .setColor('RED');
            return mes.edit(embed);
        }
        new SearchManager(this.client, message.author, mes, mods).initialize().catch(logger.error);
    }
}
