import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { ArtistType } from "../entities";

export class ArtistTypeRepository extends LinqRepository<ArtistType> {
    public constructor(dataSource: DataSource) {
        super(dataSource, ArtistType);
    }
}
