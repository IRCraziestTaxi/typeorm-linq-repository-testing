import { Artist } from "../entities";
import { ArtistRepository, ArtistTypeRepository } from "../repositories";
import { AddArtistCommand } from "./add-artist.command";

export class AddArtistHandler {
    public constructor(
        private readonly _artistRepository: ArtistRepository,
        private readonly _artistTypeRepository: ArtistTypeRepository
    ) {}

    public async execute(command: AddArtistCommand): Promise<number> {
        const existingNameArtist = await this._artistRepository
            .getOne()
            .where(a => a.name)
            .equal(command.name);

        if (existingNameArtist) {
            throw new Error("An artist with that name already exists.");
        }

        const artistType = await this._artistTypeRepository.getById(command.artistTypeId);

        if (!artistType) {
            throw new Error("Invalid artist type ID.");
        }

        const addArtist = new Artist();
        addArtist.artistTypeId = command.artistTypeId;
        addArtist.name = command.name;
        const createdArtist = await this._artistRepository.create(addArtist);

        return createdArtist.id;
    }
}
