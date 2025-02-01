export default function moveTask(tasks, setTasks, taskId, direction, statusConfig) {
    const statusKeys = Object.keys(statusConfig);

    setTasks(tasks.map(task => {
        if (task.id === taskId) {
            const currentIndex = statusKeys.indexOf(task.status);
            const newIndex = currentIndex + direction;

            if (newIndex >= 0 && newIndex < statusKeys.length) {
                return { ...task, status: statusKeys[newIndex] };
            }
        }
        return task;
    }));
}
