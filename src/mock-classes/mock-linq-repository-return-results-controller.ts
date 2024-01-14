import { EntityBase } from "typeorm-linq-repository/src/types/EntityBase";
import { MockLinqRepositoryReturnResultsControllerComparer, MockLinqRepositoryReturnResultsControllerComparerSequence } from "../types";

export class MockLinqRepositoryReturnResultsController<T extends EntityBase> {
    private readonly _comparerSequences: MockLinqRepositoryReturnResultsControllerComparerSequence<T>[] = [];

    private _currentComparerSequenceId: number;

    public createComparerSequence(...comparers: MockLinqRepositoryReturnResultsControllerComparer<T>[]): void {
        const sequence: MockLinqRepositoryReturnResultsControllerComparerSequence<T> = {
            comparers,
            sequenceId: this._comparerSequences.length + 1
        };
        this._comparerSequences.push(sequence);
        this._currentComparerSequenceId = sequence.sequenceId;
    }

    public getCurrentComparerSequence(): MockLinqRepositoryReturnResultsControllerComparerSequence<T> {
        const sequence = this._comparerSequences.find(s => s.sequenceId === this._currentComparerSequenceId);

        return sequence;
    }
}
