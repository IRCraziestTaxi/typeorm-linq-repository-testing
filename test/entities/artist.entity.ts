import { nameof } from "ts-simple-nameof";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArtistType } from "./artist-type.entity";

@Entity()
export class Artist {
    @ManyToOne(() => ArtistType, at => at.artists)
    @JoinColumn({ name: nameof<Artist>(a => a.artistTypeId) })
    public artistType: ArtistType;

    @Column({ nullable: false })
    public artistTypeId: number;

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public name: string;
}
