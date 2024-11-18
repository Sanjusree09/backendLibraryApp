// import { Entity } from "typeorm"

// @Entity()
// export class Admin {
//     id!: number
//     name!: string 
//     description!: string
//     filename: string | undefined
//     views: number | undefined
//     isPublished: boolean | undefined
// }


import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    isActive!: boolean
}