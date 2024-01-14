import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./artist.entity";

@Entity()
export class ArtistType {
    @OneToMany(() => Artist, a => a.artistType)
    public artists: Artist[];

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public name: string;
}
