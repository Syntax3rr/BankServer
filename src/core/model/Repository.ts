export abstract class Repository<T> {
    protected readonly repository: Map<string, Partial<T>> = new Map();

    protected abstract getFromDB<V extends keyof T>(index: { [key: string]: string }, ...params: V[]): Promise<Partial<T>>

    protected updateRepository(key: string, partial: Partial<T>) {
        if (this.repository.has(key)) {
            let currentPartial = this.repository[key];
            // Merge fields
            for (const k in partial) {
                currentPartial.set(k, partial[k]);
            }
        } else {
            this.repository.set(key, partial);
        }
    }
}