import TaskCard from "./TaskCard";

export default function TaskColumn({ statusKey, label, color, tasks, setEditTask, onMoveTask, onDeleteTask }) {
    const filteredTasks = tasks.filter(task => task.status === statusKey);

    return (
        <div className={`bg-gradient-to-b ${color} rounded-xl p-5 shadow-lg relative overflow-hidden transition-all hover:shadow-xl flex flex-col h-auto min-h-[200px]`}>
            <h2 className="font-bold text-gray-700 text-lg">{label}</h2>
            <div className="flex-1 flex flex-col gap-4">
                {filteredTasks.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        setEditTask={setEditTask} 
                        onMoveTask={onMoveTask} 
                        onDeleteTask={onDeleteTask} // ✅ Pass delete function
                    />
                ))}
            </div>
        </div>
    );
}
