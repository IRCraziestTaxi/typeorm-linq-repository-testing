import { Repository, SelectQueryBuilder } from "typeorm";
import { ILinqRepository, IQuery } from "typeorm-linq-repository";
import { EntityBase } from "typeorm-linq-repository/src/types/EntityBase";
import { MockLinqRepositoryReturnResultsControllerComparer } from "../types";
import { MockLinqRepositoryReturnResultsController } from "./mock-linq-repository-return-results-controller";
import { MockQuery } from "./mock-query";

export class MockLinqRepository<T extends EntityBase> implements ILinqRepository<T> {
    public constructor(
        private readonly _entities: T[],
        private readonly _returnResultsController?: MockLinqRepositoryReturnResultsController<T>
    ) {}

    public get typeormRepository(): Repository<T> {
        throw new Error("Property typeormRepository is not implemented.");
    }

    public async create<E extends T | T[]>(entities: E): Promise<E> {
        if (Array.isArray(entities)) {
            for (let i = 0; i < entities.length; i++) {
                entities[i].id = this._entities.length + i;
            }
        }
        else {
            (entities as any).id = this._entities.length + 1;
        }

        return entities;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public createQueryBuilder(alias: string): SelectQueryBuilder<T> {
        throw new Error("Method createQueryBuilder is not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async delete(entities: string | number | T | T[]): Promise<boolean> {
        return true;
    }

    public getAll(): IQuery<T, T[], T> {
        const comparer = this.getComparer();
        const entities = comparer
            ? this._entities.filter(a => comparer(a))
            : this._entities;

        return new MockQuery<T, T[]>(entities) as any as IQuery<T, T[], T>;
    }

    public getById(id: string | number): IQuery<T, T, T> {
        const entity = this._entities.find(e => (e as any).id === id);

        return new MockQuery<T, T>(entity) as any as IQuery<T, T, T>;
    }

    public getOne(): IQuery<T, T, T> {
        const comparer = this.getComparer();
        const entity = comparer
            ? this._entities.find(a => comparer(a))
            : undefined;

        return new MockQuery<T, T>(entity) as any as IQuery<T, T, T>;
    }

    public async update<E extends T | T[]>(entities: E): Promise<E> {
        return this.upsert(entities);
    }

    public async upsert<E extends T | T[]>(entities: E): Promise<E> {
        return entities;
    }

    private getComparer(): MockLinqRepositoryReturnResultsControllerComparer<T> {
        let comparer: MockLinqRepositoryReturnResultsControllerComparer<T>;

        if (this._returnResultsController) {
            const sequence = this._returnResultsController.getCurrentComparerSequence();

            if (!sequence) {
                throw new Error("Comparer sequence was not found.");
            }

            comparer = sequence.comparers.shift();

            if (!comparer) {
                throw new Error("Comparer function was not found.");
            }
        }

        return comparer;
    }
}
