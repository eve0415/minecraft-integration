import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Server extends BaseEntity {
    @PrimaryColumn({ unique: true })
    public serverID!: number;

    @Column({ nullable: true })
    public name!: string;

    public constructor(data?: { serverID: number, name: string }) {
        super();
        if (!data) return;
        this.serverID = data.serverID;
        this.name = data.name;
    }
}
