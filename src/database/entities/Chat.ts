import { Snowflake } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
    @PrimaryColumn()
    public channelID!: Snowflake;

    @Column()
    public serverID!: number;

    public constructor(data?: { channelID: string, serverID: number }) {
        super();
        if (!data) return;
        this.channelID = data.channelID;
        this.serverID = data.serverID;
    }
}
