export abstract class DBRepository<T> {
    protected readonly repository: Map<string, Partial<T>> = new Map();

    protected abstract getFromDB<V extends keyof T>(index: { [key: string]: string }, ...params: V[]): Promise<Partial<T>>

    protected abstract updateDB(key: string, partial: Partial<T>): Promise<void>
}