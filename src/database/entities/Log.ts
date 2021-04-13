import { Snowflake } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Log extends BaseEntity {
    @PrimaryColumn({ unique: true })
    public channelID!: Snowflake;

    @Column()
    public serverID!: number;

    public constructor(data?: { channelID: Snowflake, serverID: number }) {
        super();
        if (!data) return;
        this.channelID = data.channelID;
        this.serverID = data.serverID;
    }
}
