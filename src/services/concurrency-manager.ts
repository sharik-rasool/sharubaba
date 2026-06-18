/**
 * Execute tasks in parallel with a controlled concurrency limit
 */
export async function runWithConcurrencyLimit<T>(
    tasks: (() => Promise<T>)[],
    limit: number = 3
): Promise<T[]> {
    const results: T[] = new Array(tasks.length);
    const executing: Promise<void>[] = [];
    
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        
        // Wrap task execution to record result in the correct order
        const p = Promise.resolve()
            .then(() => task())
            .then((res) => {
                results[i] = res;
            })
            .catch((err) => {
                // If a task fails, catch it here and record as an error object
                // so it doesn't crash other parallel tasks in the pool
                console.error(`[CONCURRENCY MANAGER] Task ${i} failed:`, err.message || err);
                results[i] = err as unknown as T;
            })
            .finally(() => {
                // Remove itself from active execution list when finished
                const idx = executing.indexOf(p);
                if (idx !== -1) {
                    executing.splice(idx, 1);
                }
            });
            
        executing.push(p);
        
        // If pool limit is reached, wait for at least one task to finish before launching more
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    
    // Wait for all remaining active tasks to finish
    await Promise.all(executing);
    return results;
}
