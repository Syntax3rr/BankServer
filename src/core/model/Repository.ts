export abstract class Repository<T> {
    protected readonly repository: Map<string, Partial<T>> = new Map()

    protected abstract getFromDB<V extends keyof T>(key: string, ...params: V[]): Pick<T, V>

    protected updateRepository(key: string, partial: Partial<T>) {
        if (this.repository.has(key)) {
            let currentPartial = this.repository[key]
            // Merge fields
            for (const k in partial) {
                currentPartial.set(k, partial[k])
            }
        } else {
            this.repository.set(key, partial)
        }
    }
}