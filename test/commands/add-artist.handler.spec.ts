import { nameof } from "ts-simple-nameof";
import { MockLinqRepository, MockLinqRepositoryReturnResultsController } from "../../src/mock-classes";
import { Artist, ArtistType } from "../entities";
import { ArtistRepository, ArtistTypeRepository } from "../repositories";
import { AddArtistCommand } from "./add-artist.command";
import { AddArtistHandler } from "./add-artist.handler";

describe(nameof(AddArtistHandler), () => {
    const mockArtistType1 = new ArtistType();
    mockArtistType1.id = 1;
    mockArtistType1.name = "Painter";
    const mockArtistType2 = new ArtistType();
    mockArtistType2.id = 2;
    mockArtistType2.name = "Musician";
    const mockArtist = new Artist();
    mockArtist.artistTypeId = 1;
    mockArtist.name = "John Doe";
    const returnResultsController = new MockLinqRepositoryReturnResultsController<Artist>();
    let handler: AddArtistHandler;

    beforeEach(() => {
        handler = new AddArtistHandler(
            new MockLinqRepository([mockArtist], returnResultsController) as any as ArtistRepository,
            new MockLinqRepository([mockArtistType1, mockArtistType2]) as any as ArtistTypeRepository
        );
    });

    it("should add artist if IDs are valid and no artist with same name exists", async () => {
        const command = new AddArtistCommand();
        command.artistTypeId = mockArtistType1.id;
        command.name = "Jane Doe";
        returnResultsController.createComparerSequence(a => a.name === command.name);
        const result = await handler.execute(command);
        expect(result).toBeTruthy();
    });

    it("should throw error if artist with same name exists", async () => {
        const command = new AddArtistCommand();
        command.artistTypeId = mockArtistType1.id;
        command.name = mockArtist.name;
        returnResultsController.createComparerSequence(a => a.name === command.name);
        let caughtError: Error;

        try {
            await handler.execute(command);
        }
        catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeInstanceOf(Error);
        expect(caughtError.message).toBe("An artist with that name already exists.");
    });

    it("should throw error if invalid artist type ID is provided", async () => {
        const command = new AddArtistCommand();
        command.artistTypeId = 3;
        command.name = "Jane Doe";
        returnResultsController.createComparerSequence(a => a.name === command.name);
        let caughtError: Error;

        try {
            await handler.execute(command);
        }
        catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeInstanceOf(Error);
        expect(caughtError.message).toBe("Invalid artist type ID.");
    });
});
