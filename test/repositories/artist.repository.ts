import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { Artist } from "../entities";

export class ArtistRepository extends LinqRepository<Artist> {
    public constructor(dataSource: DataSource) {
        super(dataSource, Artist);
    }
}
