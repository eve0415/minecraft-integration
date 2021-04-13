import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Server extends BaseEntity {
    @PrimaryColumn({ unique: true })
    public serverID!: number;

    @Column()
    public type!: string;

    @Column({ nullable: true })
    public name!: string;

    public constructor(data?: { serverID: number, type: string, name?: string }) {
        super();
        if (!data) return;
        this.serverID = data.serverID;
        this.type = data.type;
        if (data.name) this.name = data.name;
    }
}
