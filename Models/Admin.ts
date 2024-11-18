import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity()
export class Admin {
    @PrimaryColumn()
    id!: number;

    @Column()
    name: string | undefined;

    @Column()
    description: string | undefined;


}