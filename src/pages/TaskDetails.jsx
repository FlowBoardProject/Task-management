import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { TaskHeader } from "../components/TaskHeader";
import { TaskActions } from "../components/TaskActions";
import { TaskInfo } from "../components/TaskInfo";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { TaskComments } from "../components/TaskComments";

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        console.log("Task ID from URL:", id); // Debugging

        if (!id) {
            console.error("❌ No task ID found in URL");
            return;
        }

        // 🔥 Make sure `id` is a string to match task ID
        const foundTask = initialTasks.find(task => task.id.toString() === id.toString());

        if (foundTask) {
            setTask(foundTask);
            setEditedTask({ ...foundTask });
        } else {
            console.warn("⚠️ Task not found for ID:", id);
        }
    }, [id]);

    const handleSaveEdit = () => {
        setTask(editedTask);
        setIsEditing(false);
    };

    const handleDeleteTask = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        navigate("/task-board");
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    if (!task) {
        return <div className="text-center text-gray-600 mt-10">Task not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <TaskHeader title={task.title} description={task.description} />

            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <TaskActions 
                    isEditing={isEditing} 
                    onEditToggle={() => setIsEditing(!isEditing)} 
                    onSave={handleSaveEdit} 
                    onDelete={handleDeleteTask} 
                />

                <TaskInfo 
                    isEditing={isEditing} 
                    task={editedTask} 
                    setTask={setEditedTask} 
                    users={users} 
                />

                <TaskComments 
                    comments={comments} 
                    newComment={newComment} 
                    setNewComment={setNewComment} 
                    commenterName={commenterName} 
                    setCommenterName={setCommenterName} 
                    setComments={setComments} 
                />

                <div className="mt-6">
                    <Link to="/tasks">
                        <Button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                            Back to Tasks
                        </Button>
                    </Link>
                </div>
            </div>

            {showDeleteModal && <DeleteConfirmationModal onConfirm={confirmDelete} onCancel={cancelDelete} />}
        </div>
    );
}
