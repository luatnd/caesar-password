/**
 * Register and run some task later with control
 */
export class SimpleTaskManager {
  registeredTasks: Record<string, () => void> = {}
  register(key: string, task: () => void) {
    this.registeredTasks[key] = task;
  }
  async flush() {
    await Promise.all(
      Object.values(this.registeredTasks)
        // make sure all task is oke
        .map(task => new Promise(async resolve => {
          try {
            await task()
          } catch (e) {}
          resolve(true)
        }))
    );
    this.registeredTasks = {}
  }
}
