import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Send, MessageCircle, Edit, Save, XCircle, User, ChevronDown, Trash2 } from "lucide-react";

const initialTasks = [
    { id: "1", title: "Design Homepage", description: "Create homepage UI", deadline: "2024-02-15", priority: "High", assignedTo: ["Alice"], status: "todo" },
    { id: "2", title: "Implement Login", description: "Develop login system", deadline: "2024-02-20", priority: "Medium", assignedTo: ["Bob"], status: "in-progress" },
    { id: "3", title: "Test API Endpoints", description: "Ensure all API calls work", deadline: "2024-02-25", priority: "Low", assignedTo: ["Charlie"], status: "done" },
];

const users = ["Alice", "Bob", "Charlie", "Dave", "Eve"];

export default function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commenterName, setCommenterName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const foundTask = initialTasks.find(task => task.id === id);
        if (foundTask) {
            setTask(foundTask);
            setEditedTask({ ...foundTask });
        }
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim() === "" || commenterName.trim() === "") return;
        setComments([...comments, { name: commenterName, text: newComment, date: new Date().toLocaleString() }]);
        setNewComment("");
        setCommenterName("");
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedTask(task);
    };

    const handleSaveEdit = () => {
        setTask(editedTask);
        setIsEditing(false);
    };

    const handleDeleteTask = () => {
        setShowDeleteModal(true); // Show confirmation modal
    };

    const confirmDelete = () => {
        setShowDeleteModal(false); // Close modal
        navigate("/Task-Board"); // Redirect after deletion
    };

    const cancelDelete = () => {
        setShowDeleteModal(false); // Close modal
    };

    const toggleUserSelection = (user) => {
        setEditedTask((prevTask) => ({
            ...prevTask,
            assignedTo: prevTask.assignedTo.includes(user)
                ? prevTask.assignedTo.filter((u) => u !== user) // Remove user
                : [...prevTask.assignedTo, user], // Add user
        }));
    };

    if (!task) {
        return <div className="text-center text-gray-600 mt-10">Task not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 🏆 Hero Section */}
            <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-12">
                <h1 className="text-3xl font-bold">{task.title}</h1>
                <p className="text-lg opacity-90 mt-2">{task.description}</p>
            </div>

            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">


{/* Task Details Section */}
<div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
    
    {/* Buttons Section */}
    <div className="flex gap-2">
        {!isEditing ? (
            <>
                {/* ✏️ Edit Button */}
                <Button 
                    onClick={handleEditToggle} 
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex items-center gap-1"
                >
                    <Edit size={16} />
                </Button>
                
                {/* ❌ Delete Button (Aligned with Edit) */}
                <Button 
                    onClick={handleDeleteTask} 
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                >
                    <Trash2 size={16} />
                </Button>
            </>
        ) : (
            <>
                {/* ✅ Save Button */}
                <Button 
                    onClick={handleSaveEdit} 
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                >
                    <Save size={16} /> Save
                </Button>

                {/* ❌ Cancel Button */}
                <Button 
                    onClick={handleEditToggle} 
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 flex items-center gap-1"
                >
                    <XCircle size={16} /> Cancel
                </Button>

                {/* ❌ Delete Button (Still Accessible) */}
                <Button 
                    onClick={handleDeleteTask} 
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                >
                    <Trash2 size={16} />
                </Button>
            </>
        )}
    </div>
</div>


                {/* Task Info */}
                <div className="space-y-3">
                    <div>
                        <label className="font-semibold">Description:</label>
                        {isEditing ? (
                            <Input value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} />
                        ) : (
                            <p className="text-gray-700">{task.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Deadline:</label>
                        {isEditing ? (
                            <Input type="date" value={editedTask.deadline} onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })} />
                        ) : (
                            <p className="text-gray-700">{task.deadline}</p>
                        )}
                    </div>

                    {/* Assigned To (Multi-Select Dropdown) */}
                    <div className="relative">
                        <label className="font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-green-500" />
                            Assign To
                        </label>
                        {isEditing ? (
                            <div className="relative">
                                <div onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full p-3 border rounded-lg cursor-pointer flex items-center justify-between">
                                    {editedTask.assignedTo.length > 0 ? editedTask.assignedTo.join(", ") : "Select team members"}
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 z-10">
                                        <ul className="max-h-40 overflow-y-auto p-2">
                                            {users.map((user) => (
                                                <li key={user} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                                    <input type="checkbox" checked={editedTask.assignedTo.includes(user)} onChange={() => toggleUserSelection(user)} className="w-4 h-4" />
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
                    {/* Priority Dropdown */}
                    <div>
                        <label className="font-semibold">Priority:</label>
                        {isEditing ? (
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={editedTask.priority}
                                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        ) : (
                            <p className="text-gray-700">{task.priority}</p>
                        )}
                    </div>
                </div>

 {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center w-96">
                            <h2 className="text-lg font-semibold text-gray-900">Are you sure?</h2>
                            <p className="text-gray-600 mt-2">This action cannot be undone.</p>
                            <div className="flex gap-4 mt-6 justify-center">
                                <Button onClick={confirmDelete} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">Delete</Button>
                                <Button onClick={cancelDelete} className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600">Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}
   {/* 🗨️ Comments Section */}
   <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MessageCircle size={20} /> Comments
                    </h3>

                    {/* Input to Add Comment */}
                    <div className="flex flex-col gap-2 mt-3">
                        <Input
                            value={commenterName}
                            onChange={(e) => setCommenterName(e.target.value)}
                            placeholder="Your Name"
                            className="border rounded-lg p-2"
                        />
                        <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="border rounded-lg p-2"
                        />
                        <Button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 w-fit">
                            <Send size={16} /> Post
                        </Button>
                    </div>

                    {/* Display Comments */}
                    <div className="mt-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="bg-gray-100 p-3 rounded-lg my-2 shadow-sm">
                                    <p className="font-semibold text-gray-800">{comment.name}</p>
                                    <p className="text-gray-700">{comment.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{comment.date}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 🔙 Back Button */}
                <div className="mt-6">
                    <Link to="/Task-Board">
                        <Button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                            Back to Tasks
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
