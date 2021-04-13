import { Snowflake } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Status extends BaseEntity {
    @PrimaryColumn()
    public channelID!: Snowflake;

    @Column()
    public messageID!: Snowflake;

    public constructor(data?: { channelID: Snowflake, messageID: Snowflake }) {
        super();
        if (!data) return;
        this.channelID = data.channelID;
        this.messageID = data.messageID;
    }
}
