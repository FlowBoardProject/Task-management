import { useState } from "react";
import { Input } from "../components/ui/Input";
import { User, Flag, ChevronDown } from "lucide-react";

export function TaskInfo({ isEditing, task, setTask, users }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleUserSelection = (user) => {
        setTask((prevTask) => ({
            ...prevTask,
            assignedTo: prevTask.assignedTo.includes(user)
                ? prevTask.assignedTo.filter((u) => u !== user) // Remove user
                : [...prevTask.assignedTo, user], // Add user
        }));
    };

    return (
        <div className="space-y-3">
            {/* Description */}
            <div>
                <label className="font-semibold">Description:</label>
                {isEditing ? (
                    <Input
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                    />
                ) : (
                    <p className="text-gray-700">{task.description}</p>
                )}
            </div>

            {/* Deadline */}
            <div>
                <label className="font-semibold">Deadline:</label>
                {isEditing ? (
                    <Input
                        type="date"
                        value={task.deadline}
                        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                    />
                ) : (
                    <p className="text-gray-700">{task.deadline}</p>
                )}
            </div>

            {/* Priority Selection */}
            <div>
                <label className="font-semibold flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-500" />
                    Priority:
                </label>
                {isEditing ? (
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        value={task.priority}
                        onChange={(e) => setTask({ ...task, priority: e.target.value })}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                ) : (
                    <p className="text-gray-700">{task.priority}</p>
                )}
            </div>

            {/* Assigned To Selection */}
            <div className="relative">
                <label className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    Assigned To:
                </label>
                {isEditing ? (
                    <div className="relative">
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        >
                            {task.assignedTo.length > 0
                                ? task.assignedTo.join(", ")
                                : "Select team members"}
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
                                                checked={task.assignedTo.includes(user)}
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
                ) : (
                    <p className="text-gray-700">{task.assignedTo.join(", ")}</p>
                )}
            </div>
        </div>
    );
}
