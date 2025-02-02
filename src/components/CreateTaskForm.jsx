import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { addTaskToFirebase } from "../services/taskService"; // ✅ Import correctly
import { useAuth } from "../context/AuthContext"; // ✅ Use Auth Context
import { getUsersByDepartment } from "../services/userService"; // ✅ Fetch users by department

import { Calendar, User, Flag, Rocket, ChevronDown } from "lucide-react";

export default function CreateTaskForm({ onAddTask, users }) {
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        assignedTo: [],
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user } = useAuth(); // ✅ Get logged-in user
    const [filteredUsers, setFilteredUsers] = useState([]); // ✅ Store users from the same department

    useEffect(() => {
        if (user?.departments) {
            console.log("🔍 Fetching users for department:", user.departments);

            getUsersByDepartment(user.departments)
                .then((users) => {
                    if (Array.isArray(users) && users.length > 0) {
                        console.log("✅ Users fetched:", users);  // ✅ Debugging step
                        setFilteredUsers(users);
                    } else {
                        setFilteredUsers([]);
                        setError("⚠ No users found in your department.");
                    }
                })
                .catch(() => setError("❌ Failed to load department users."));
        }
    }, [user]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newTask.title.trim() || !newTask.description.trim() || !newTask.deadline.trim() || newTask.assignedTo.length === 0) {
            setError("Please fill in all fields before submitting.");
            return;
        }

        if (!user) {
            setError("You must be logged in to create a task.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const taskData = {
                ...newTask,
                createdBy: user.uid,
                departments: user.departments
            };

            console.log("📌 Task being sent to Firebase:", taskData); // ✅ Debugging log

            const taskId = await addTaskToFirebase(taskData);
            onAddTask({ id: taskId, ...taskData });

            setNewTask({
                title: "",
                description: "",
                deadline: "",
                priority: "Medium",
                assignedTo: [],
            });
        } catch (err) {
            setError("Failed to save task. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const toggleUserSelection = (selectedUserFullName) => {
        setNewTask((prevTask) => {
            const updatedAssignedTo = prevTask.assignedTo.includes(selectedUserFullName)
                ? prevTask.assignedTo.filter((name) => name !== selectedUserFullName)
                : [...prevTask.assignedTo, selectedUserFullName];

            console.log("📌 Updated assignedTo:", updatedAssignedTo); // ✅ Debugging log

            return {
                ...prevTask,
                assignedTo: updatedAssignedTo,
            };
        });
    };


    return (
        <div className="max-w-2xl mx-auto mb-8 p-8 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border">
            {/* Title Section */}
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    Create New Task
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Task Description */}
                <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        📝 Description
                    </label>
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description..."
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        Deadline
                    </label>
                    <input
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
                    />
                </div>

                {/* Priority */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-red-500" />
                        Priority
                    </label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                </div>

                {/* Assign To (Filtered by Department) */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        Assign To
                    </label>
                    <div className="relative">
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="cursor-pointer flex items-center justify-between p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200"
                        >
                            {newTask.assignedTo.length > 0 ? <span>{newTask.assignedTo.join(", ")}</span> : <span className="text-gray-400">Select team members</span>}
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 z-10">
                                <ul className="max-h-40 overflow-y-auto p-2">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((teamMember) => {
                                            const fullName = `${teamMember.firstName || ""} ${teamMember.lastName || ""}`.trim(); // ✅ Use full name

                                            return fullName ? (
                                                <li key={teamMember.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newTask.assignedTo.includes(fullName)}
                                                        onChange={() => toggleUserSelection(fullName)}
                                                    />
                                                    {fullName}
                                                </li>
                                            ) : null;
                                        })
                                    ) : (
                                        <li className="p-2 text-gray-500">No users available</li>
                                    )}

                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm col-span-2">{error}</p>}

                {/* Submit Button */}
                <div className="md:col-span-2 mt-6">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Create Task"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
