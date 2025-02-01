import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import EditTaskModal from "../components/ui/EditTaskModal";
import TaskColumn from "../components/TaskColumn";
import TaskFilters from "../components/TaskFilters";  // ✅ Import new filter component
import TaskCard from "../components/TaskCard"; // ✅ Import TaskCard for List View
import moveTask from "../utils/MoveTask";

const initialTasks = [
    { id: "1", title: "Design Homepage", deadline: "2024-02-15", priority: "High", assignedTo: ["Alice"], status: "todo" },
    { id: "2", title: "Implement Login", deadline: "2024-02-20", priority: "Medium", assignedTo: ["Bob"], status: "in-progress" },
    { id: "3", title: "Test API Endpoints", deadline: "2024-02-25", priority: "Low", assignedTo: ["Charlie"], status: "done" },
];

const statusConfig = {
    todo: { label: "To Do", color: "from-blue-50 to-blue-100" },
    "in-progress": { label: "In Progress", color: "from-yellow-50 to-yellow-100" },
    done: { label: "Done", color: "from-green-50 to-green-100" }
};

const users = ["Alice", "Bob", "Charlie", "Dave", "Eve"];

export default function TaskBoard() {
    const [tasks, setTasks] = useState(initialTasks);
    const [editTask, setEditTask] = useState(null);
    const [notification, setNotification] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // ✅ Grid or List view mode

    // ✅ Filter state
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleMoveTask = (taskId, direction) => {
        moveTask(tasks, setTasks, taskId, direction, statusConfig);
        showNotification("Task moved!");
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        showNotification("Task deleted!");
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 2000);
    };

    // ✅ Filter & Sort Logic
    const filteredTasks = tasks
        .filter(task => filterCategory === "all" || task.status === filterCategory)
        .filter(task => filterPriority === "all" || task.priority === filterPriority)
        .sort((a, b) => sortOrder === "asc" ? 
            new Date(a.deadline) - new Date(b.deadline) : 
            new Date(b.deadline) - new Date(a.deadline)
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {notification && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-800 text-white rounded-full shadow-lg animate-fade-in flex items-center gap-2">
                    <span className="animate-bounce">🎯</span>
                    {notification}
                </div>
            )}

            {editTask && (
                <EditTaskModal
                    task={editTask}
                    users={users}
                    onSave={(updatedTask) => {
                        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
                        setEditTask(null);
                    }}
                    onClose={() => setEditTask(null)}
                />
            )}

            <CreateTaskForm 
                onAddTask={(task) => setTasks([...tasks, { id: Date.now().toString(), ...task, status: "todo" }])} 
                users={users} 
            />

            {/* ✅ Filters & View Mode Toggle */}
            <TaskFilters 
                filterCategory={filterCategory} 
                setFilterCategory={setFilterCategory}
                filterPriority={filterPriority} 
                setFilterPriority={setFilterPriority}
                sortOrder={sortOrder} 
                setSortOrder={setSortOrder}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* ✅ Conditional Rendering for Grid/List View */}
            {viewMode === "grid" ? (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-start grid-auto-rows-min">
                    {Object.entries(statusConfig).map(([statusKey, { label, color }]) => (
                        <TaskColumn
                            key={statusKey}
                            statusKey={statusKey}
                            label={label}
                            color={color}
                            tasks={filteredTasks.filter(task => task.status === statusKey)}
                            setTasks={setTasks}
                            setEditTask={setEditTask}
                            onMoveTask={handleMoveTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>
            ) : (
                <div className="max-w-6xl mx-auto mt-6 space-y-4">
                    {filteredTasks.map(task => (
                        <TaskCard 
                            key={task.id}
                            task={task}
                            setEditTask={setEditTask}
                            onMoveTask={handleMoveTask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
