import { MessageEmbed } from 'discord.js';
import { websocketClient } from '../..';
import { Server } from '../../database/entities';
import { LogData, MinecraftKey, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'log');
    }

    public async run(log: LogData): Promise<void> {
        const server = await Server.findOne({ serverID: log.port });
        const serverName = server?.name ?? server?.type;

        const embed = new MessageEmbed()
            .setAuthor(log.name, log.UUID?.startsWith('00000000') ? undefined : `https://crafatar.com/avatars/${log.UUID}`)
            .addFields(
                [
                    { name: 'Username', value: log.name, inline: true },
                    { name: 'UUID', value: log.UUID ?? 'N/A', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                ],
            )
            .setFooter(`ID: ${server?.serverID}`)
            .setTimestamp(new Date);

        if (log.mods) {
            embed.addFields(
                [
                    { name: 'client', value: log.type ?? 'Unknown', inline: true },
                    { name: 'version', value: log.version, inline: true },
                    { name: 'mods', value: log.mods, inline: true },
                ],
            );
        } else if (log.version) {
            embed.addFields(
                [
                    { name: 'client', value: log.type ?? 'Unknown', inline: true },
                    { name: 'version', value: log.version, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                ],
            );
        }

        switch (log.event) {
            case 'AUTH':
                embed
                    .setColor('BLUE')
                    .setTitle(`${log.name} is trying to connect to server ${serverName}`)
                    .setDescription(`\`${log.name}(${log.ip})\` is trying to connect to server \`${serverName}\` ${log.address ? `by using \`${log.address}\` to connect` : ''}.`);
                break;

            case 'LOGIN':
                embed
                    .setColor('BLUE')
                    .setTitle(`${log.name} is logging in to server ${serverName}`)
                    .setDescription(`\`${log.name}(${log.ip})\` is logging in to server \`${serverName}\` ${log.address ? `by using \`${log.address}\` to connect` : ''}.`);
                break;

            case 'DISCONNECT':
                embed
                    .setColor('BLUE')
                    .setTitle(`${log.name} has disconnected from server ${serverName}`)
                    .setDescription(`\`${log.name}(${log.ip})\` has disconnected from server \`${serverName}\`.`);
                break;

            case 'KICK':
                embed
                    .setColor('RED')
                    .setTitle(`${log.name} was kicked from server ${serverName}`)
                    .setDescription(`\`${log.name}(${log.ip})\` was kicked from server because of \`${log.reason}\``)
                    .addField('Reason', log.reason);
                break;

            case 'KICKEDFROM':
                /* eslint-disable no-case-declarations */
                const r = log.reason?.split(': ').pop() ?? '';
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const reason = this.client.instance.localizations?.strings.reasons[r as keyof MinecraftKey['reasons']] ?? r;
                let desc = `Failed to forward \`${log.name}(${log.ip})\` to server because of \`${reason}\``;
                /* eslint-enable no-case-declarations */
                if (log.fulfill === 'DisconnectPlayer') {
                    desc += '\nDisconnecting from server.';
                } else if (log.fulfill === 'RedirectPlayer') {
                    desc += '\nForwarding to another server.';
                }

                embed
                    .setColor('RED')
                    .setTitle(`Failed to forward ${log.name} to server ${log.fromServer}`)
                    .setDescription(desc)
                    .addField('Reason', reason, true)
                    .addField('\u200B', '\u200B', true)
                    .addField('Fulfill', log.fulfill, true);
                break;

            case 'PRECONNECT':
                embed
                    .setColor('PURPLE')
                    .setTitle(`Forwarding ${log.name} to server ${log.toServer}`)
                    .setDescription(`Forwarding \`${log.name}(${log.ip}\`) to server \`${log.toServer}\` as requested.`);
                break;

            case 'POSTCONNECT':
                embed
                    .setColor('PURPLE')
                    .setTitle(`Succesfully connected ${log.name} to server ${log.currentServer} ${log.fromServer ? `from ${log.fromServer}` : ''}`)
                    .setDescription(`Succesfully connected \`${log.name}(${log.ip})\` to server \`${log.currentServer}\`${log.fromServer ? ` from \`${log.fromServer}\`.` : ''}`);
                break;
        }

        this.client.instance.logManager.sendWebhook(log.port, embed);
    }
}
