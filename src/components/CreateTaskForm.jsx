import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
    Calendar,
    User,
    Flag,
    Rocket,
    XCircle,
    ChevronDown,
} from "lucide-react";

export default function CreateTaskForm({ onAddTask, users }) {
    const [newTask, setNewTask] = useState({
        title: "",
        deadline: "",
        priority: "Medium",
        assignedTo: [],
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !newTask.title.trim() ||
            !newTask.deadline.trim() ||
            newTask.assignedTo.length === 0
        )
            return;

        onAddTask(newTask);
        setNewTask({ title: "", deadline: "", priority: "Medium", assignedTo: [] });
    };

    const toggleUserSelection = (user) => {
        setNewTask((prevTask) => ({
            ...prevTask,
            assignedTo: prevTask.assignedTo.includes(user)
                ? prevTask.assignedTo.filter((u) => u !== user) // Remove user
                : [...prevTask.assignedTo, user], // Add user
        }));
    };

    return (
        <div className="max-w-2xl mx-auto mb-8 p-8 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100 transition-all hover:shadow-2xl hover:-translate-y-1">
            {/* Title Section */}
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    Create New Task
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Task Title */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-500" />
                        Task Title
                    </label>
                    <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title..."
                        className="border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 rounded-xl"
                    />
                </div>

                {/* Fixed Date Picker */}
                <div className="space-y-2 relative">
                    {/* Label for accessibility */}
                    <label
                        htmlFor="deadlinePicker"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                        <Calendar className="w-4 h-4 text-purple-500" />
                        Deadline
                    </label>

                    <div className="relative">
                        {/* Date Input Field with Default Calendar Icon Removed */}
                        <input
                            type="date"
                            id="deadlinePicker"
                            value={newTask.deadline}
                            onChange={(e) =>
                                setNewTask({ ...newTask, deadline: e.target.value })
                            }
                            className="w-full p-3 pl-12 pr-10 border border-gray-300 rounded-xl focus:ring-2 
                       focus:ring-purple-300 focus:border-purple-500 bg-blue text-gray-700 
                       appearance-none cursor-pointer shadow-sm transition-all duration-200 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />

                        {/* 📅 Custom Calendar Icon (Clickable) */}
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 
                       cursor-pointer hover:text-purple-600 transition-all duration-200"
                            onClick={() =>
                                document.getElementById("deadlinePicker").showPicker()
                            }
                        >
                            <Calendar className="w-5 h-5" />
                        </div>

                        {/* ⬇ Dropdown Indicator */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-red-500" />
                        Priority
                    </label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 appearance-none cursor-pointer"
                        value={newTask.priority}
                        onChange={(e) =>
                            setNewTask({ ...newTask, priority: e.target.value })
                        }
                    >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                </div>

                {/* Assign To (Multi-Select Dropdown) */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        Assign To
                    </label>
                    <div className="relative">
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 cursor-pointer flex items-center justify-between"
                        >
                            {newTask.assignedTo.length > 0 ? (
                                <span>{newTask.assignedTo.join(", ")}</span>
                            ) : (
                                <span className="text-gray-400">Select team members</span>
                            )}
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
                                <ul className="max-h-40 overflow-y-auto p-2">
                                    {users.map((user) => (
                                        <li
                                            key={user}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newTask.assignedTo.includes(user)}
                                                onChange={() => toggleUserSelection(user)}
                                                className="w-4 h-4"
                                            />
                                            {user}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Display Selected Users as Tags */}
                {newTask.assignedTo.length > 0 && (
                    <div className="md:col-span-2 mt-2">
                        <h4 className="text-sm font-medium text-gray-600">
                            Assigned Team Members:
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {newTask.assignedTo.map((user) => (
                                <span
                                    key={user}
                                    className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                                >
                                    {user}
                                    <XCircle
                                        className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500 transition"
                                        onClick={() => toggleUserSelection(user)}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="md:col-span-2 mt-6">
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 text-lg font-semibold transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
                    >
                        Create Task
                    </Button>
                </div>
            </form>
        </div>
    );
}
