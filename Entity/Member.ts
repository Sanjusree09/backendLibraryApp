import { Entity } from "typeorm"

@Entity()
export class Member {
    id: number| undefined
    name: string| undefined
    description: string| undefined
    filename: string| undefined
    views: number| undefined
    isPublished: boolean| undefined
}