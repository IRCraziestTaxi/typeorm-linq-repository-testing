# typeorm-linq-repository-testing
Testing helpers for typeorm-linq-repository.

## Example
The tests in this repository make minimal use of the provided tools and, in fact, do not even use all of the exported tools. For example, `dataSourceMockFactory` is not used here due to the minimal nature of the tests; however, it becomes useful when dealing with other frameworks such as NestJS.

For a full-featured example of usage of these tools, see [typeorm-linq-repository-testing-nestjs](https://github.com/IRCraziestTaxi/typeorm-linq-repository-testing-nestjs).

## Rundown
In lieu of seeing the documentation at the repository linked above, consider the following entities, repositories, and handler:

`artist.entity.ts`
```ts
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
```

`artist-type.entity.ts`
```ts
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
```

`artist.repository.ts`
```ts
import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { Artist } from "../entities";

export class ArtistRepository extends LinqRepository<Artist> {
    public constructor(dataSource: DataSource) {
        super(dataSource, Artist);
    }
}
```

`artist-type.repository.ts`
```ts
import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { ArtistType } from "../entities";

export class ArtistTypeRepository extends LinqRepository<ArtistType> {
    public constructor(dataSource: DataSource) {
        super(dataSource, ArtistType);
    }
}
```

`add-artist.command.ts`
```ts
export class AddArtistCommand {
    public artistTypeId: number;
    public name: string;
}
```

`add-artist.handler.ts`
```ts
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
```

## MockLinqRepository
Again, this is a minimal example of how to use `MockLinqRepository`. Using [typeorm-linq-repository-testing-nestjs](https://github.com/IRCraziestTaxi/typeorm-linq-repository-testing-nestjs), for example, you would not construct `MockLinqRepository` directly since it provides a module to do the work for you.

Using `MockLinqRepository` in its raw form looks like this:

`add-artist.handler.spec.ts`
```ts
import { nameof } from "ts-simple-nameof";
import { MockLinqRepository, MockLinqRepositoryReturnResultsController } from "typeorm-linq-repository-testing";
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
});
```

## MockLinqRepositoryReturnResultsController
Notice the following line in the above code snippet:

```ts
const returnResultsController = new MockLinqRepositoryReturnResultsController<Artist>();
```

`MockLinqRepositoryReturnResultsController` is the crux of using this library. It allows you to tell your unit test cases what you expect from the repository for a given scenario and return different mock results based on each scenario.

`MockLinqRepositoryReturnResultsController.createComparerSequence` takes a comma separated list of anonymous functions that will be used during the test case currently being executed. The order of comparer functions provided for the current usage of `createComparerSequence` is the order in which each instance of `getOne` or `getAll` is called on the mock repository during the code path being tested.

A simple `getById` will not use this functionality; it simply returns the record passed in each mock repository's `records` array whose `id` (or equivalent configured property) property matches the argument provided to `getById`.

When testing code that uses `getOne` or `getAll`, however, if you provided a `MockLinqRepositoryReturnResultsController` to the mock repository, then you must provide one comparer function per instance of `getOne` or `getAll` encountered during the code path being tested for the test case calling `createComparerSequence`. If no `MockLinqRepositoryReturnResultsController` was provided, then the mock repository will simply return the first record for `getOne` or all records for `getAll`.

Therefore, if the code path being tested calls `getOne` or `getAll` with a `where` or similar defined, you must provide a `MockLinqRepositoryReturnResultsController` to the mock repository and you must provide a sequence of comparer functions whose length matches the number of times `getOne` and `getAll` are collectively called in the code path being tested.

A simple example where `getOne` is only called once in the code being tested:

`add-artist.handler.spec.ts`
```ts
import { nameof } from "ts-simple-nameof";
import { MockLinqRepository, MockLinqRepositoryReturnResultsController } from "typeorm-linq-repository-testing";
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
```

Note that, although the line setting up how to return results is the same in each test case:

```ts
returnResultsController.createComparerSequence(a => a.name === command.name);
```

Since `command.name` is different in each test case, each test case will receive the intended mocked entity from the mock repository given the scenario you are testing.

If the repository being mocked in the code being tested has multiple instances of `getOne` and/or `getAll`, then more than one comparer function must be passed to `createComparerSequence`.

```ts
returnResultsController.createComparerSequence(
    x => /* ... */,
    x => /* ... */,
    // ...
);
```

If at any time `getOne` or `getAll` is called on the mock repository and not enough comparer functions were provided to `createComparerSequence`, an error will be thrown with the message `"Comparer function was not found."`. If `createComparerSequence` was not called for each test case where it is needed, then an error will be thrown with the message `"Comparer sequence was not found."`.
