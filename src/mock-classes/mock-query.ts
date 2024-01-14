import { EntityBase } from "typeorm-linq-repository/src/types/EntityBase";

export class MockQuery<T extends EntityBase, R extends T | T[]> {
    public constructor(private readonly _entities: R) {}

    public and(): MockQuery<T, R> {
        return this;
    }

    public andAny(): MockQuery<T, R> {
        return this;
    }

    public andNone(): MockQuery<T, R> {
        return this;
    }

    public beginsWith(): MockQuery<T, R> {
        return this;
    }

    public catch(rejected: (results: R) => void | Promise<any>): Promise<R> {
        return this.toPromise().catch(rejected);
    }

    public contains(): MockQuery<T, R> {
        return this;
    }

    public count(): MockQuery<T, R> {
        return this;
    }

    public endsWith(): MockQuery<T, R> {
        return this;
    }

    public equal(): MockQuery<T, R> {
        return this;
    }

    public equalJoined(): MockQuery<T, R> {
        return this;
    }

    public finally(resolved: () => void): Promise<R> {
        return this.toPromise().finally(resolved);
    }

    public from(): MockQuery<T, R> {
        return this;
    }

    public greaterThan(): MockQuery<T, R> {
        return this;
    }

    public greaterThanJoined(): MockQuery<T, R> {
        return this;
    }

    public greaterThanOrEqual(): MockQuery<T, R> {
        return this;
    }

    public greaterThanOrEqualJoined(): MockQuery<T, R> {
        return this;
    }

    public groupBy(): MockQuery<T, R> {
        return this;
    }

    public in(): MockQuery<T, R> {
        return this;
    }

    public include(): MockQuery<T, R> {
        return this;
    }

    public inSelected(): MockQuery<T, R> {
        return this;
    }

    public isFalse(): MockQuery<T, R> {
        return this;
    }

    public isNotNull(): MockQuery<T, R> {
        return this;
    }

    public isNull(): MockQuery<T, R> {
        return this;
    }

    public isolatedAnd(): MockQuery<T, R> {
        return this;
    }

    public isolatedOr(): MockQuery<T, R> {
        return this;
    }

    public isolatedWhere(): MockQuery<T, R> {
        return this;
    }

    public isTrue(): MockQuery<T, R> {
        return this;
    }

    public join(): MockQuery<T, R> {
        return this;
    }

    public joinAlso(): MockQuery<T, R> {
        return this;
    }

    public lessThan(): MockQuery<T, R> {
        return this;
    }

    public lessThanJoined(): MockQuery<T, R> {
        return this;
    }

    public lessThanOrEqual(): MockQuery<T, R> {
        return this;
    }

    public lessThanOrEqualJoined(): MockQuery<T, R> {
        return this;
    }

    public notEqual(): MockQuery<T, R> {
        return this;
    }

    public notEqualJoined(): MockQuery<T, R> {
        return this;
    }

    public notIn(): MockQuery<T, R> {
        return this;
    }

    public notInSelected(): MockQuery<T, R> {
        return this;
    }

    public or(): MockQuery<T, R> {
        return this;
    }

    public orAny(): MockQuery<T, R> {
        return this;
    }

    public orderBy(): MockQuery<T, R> {
        return this;
    }

    public orderByDescending(): MockQuery<T, R> {
        return this;
    }

    public orNone(): MockQuery<T, R> {
        return this;
    }

    public reset(): MockQuery<T, R> {
        return this;
    }

    public select(): MockQuery<T, R> {
        return this;
    }

    public skip(): MockQuery<T, R> {
        return this;
    }

    public take(): MockQuery<T, R> {
        return this;
    }

    public then(resolved: (results: R) => void | Promise<any>): Promise<R> {
        return this.toPromise().then(resolved);
    }

    public thenBy(): MockQuery<T, R> {
        return this;
    }

    public thenByDescending(): MockQuery<T, R> {
        return this;
    }

    public thenGroupBy(): MockQuery<T, R> {
        return this;
    }

    public thenInclude(): MockQuery<T, R> {
        return this;
    }

    public thenJoin(): MockQuery<T, R> {
        return this;
    }

    public thenJoinAlso(): MockQuery<T, R> {
        return this;
    }

    public toPromise(): Promise<R> {
        return new Promise<R>((resolve: (values: R) => void) => {
            resolve(this._entities);
        });
    }

    public usingBaseType(): MockQuery<T, R> {
        return this;
    }

    public where(): MockQuery<T, R> {
        return this;
    }

    public whereAny(): MockQuery<T, R> {
        return this;
    }

    public whereNone(): MockQuery<T, R> {
        return this;
    }
}
