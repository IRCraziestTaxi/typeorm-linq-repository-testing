import { LinqRepository } from "typeorm-linq-repository";
import { EntityBase } from "typeorm-linq-repository/src/types/EntityBase";
import { MockLinqRepositoryReturnResultsController } from "../mock-classes";

export type MockLinqRepositoryReturnResultsControllerComparer<T extends EntityBase> = (entity: T) => boolean;

export type MockLinqRepositoryReturnResultsControllerComparerSequence<T extends EntityBase> = {
    comparers: MockLinqRepositoryReturnResultsControllerComparer<T>[];
    sequenceId: number;
}

export type EntityRepositoryRecordsPair<T extends EntityBase> = {
    records: T[];
    repository: { new (...params: any[]): LinqRepository<T> };
    returnResultsController?: MockLinqRepositoryReturnResultsController<T>;
};
