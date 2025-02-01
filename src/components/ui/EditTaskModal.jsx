import { useEffect, useState } from "react";
import { ref, update } from "firebase/database"; // ✅ Import Firebase update
import { db } from "../../firebase"; // ✅ Firebase instance
import { Button } from "./Button";
import { Input } from "./Input";
import { X, ChevronDown, User } from "lucide-react";

export default function EditTaskModal({ task, users, onSave, onClose }) {
    const [updatedTask, setUpdatedTask] = useState(task);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setUpdatedTask(task);
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // ✅ Update task in Firebase
            const taskRef = ref(db, `tasks/${updatedTask.id}`);
            await update(taskRef, updatedTask);
            console.log(`✅ Task ${updatedTask.id} updated successfully`);

            onSave(updatedTask);
            onClose(); // ✅ Close modal after saving
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    };

    const toggleUserSelection = (user) => {
        setUpdatedTask((prevTask) => ({
            ...prevTask,
            assignedTo: prevTask.assignedTo.includes(user)
                ? prevTask.assignedTo.filter((u) => u !== user) // Remove user
                : [...prevTask.assignedTo, user], // Add user
        }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full relative">
                {/* 🔥 Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
                        <X size={22} />
                    </button>
                </div>

                {/* 📝 Form Section */}
                <form onSubmit={handleSubmit} className="grid gap-4">
                    {/* Task Title */}
                    <Input
                        value={updatedTask.title}
                        onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                        placeholder="Task Title"
                        required
                        className="border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 rounded-xl"
                    />

                    {/* Deadline Picker */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Deadline
                        </label>
                        <Input
                            type="date"
                            value={updatedTask.deadline}
                            onChange={(e) => setUpdatedTask({ ...updatedTask, deadline: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white"
                        />
                    </div>

                    {/* Priority Dropdown */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4 text-red-500" />
                            Priority
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 appearance-none cursor-pointer"
                            value={updatedTask.priority}
                            onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
                        >
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>
                    </div>

                    {/* Assigned To (Multi-Select Dropdown) */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4 text-green-500" />
                            Assign To
                        </label>
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 cursor-pointer flex items-center justify-between bg-white"
                        >
                            {updatedTask.assignedTo?.length > 0 ? (
                                <span>{updatedTask.assignedTo.join(", ")}</span>
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
                                            onClick={() => {
                                                toggleUserSelection(user);
                                                setDropdownOpen(false); // ✅ Close dropdown after selection
                                            }}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={updatedTask.assignedTo.includes(user)}
                                                className="w-4 h-4"
                                            />
                                            {user}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
}
