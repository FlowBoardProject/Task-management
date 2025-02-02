import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { db } from "../firebase"; 
import { ref, get, onValue } from "firebase/database";
import { TaskHeader } from "../components/TaskHeader";
import { TaskActions } from "../components/TaskActions";
import { TaskInfo } from "../components/TaskInfo";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { TaskComments } from "../components/TaskComments";
import { updateTaskInFirebase } from "../services/taskService";

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


    
// Inside TaskDetails component
useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
        try {
            const taskRef = ref(db, `tasks/${id}`);
            const snapshot = await get(taskRef);

            if (snapshot.exists()) {
                const taskData = snapshot.val();
                setTask({ id, ...taskData });
                setEditedTask({ id, ...taskData });
            } else {
                console.warn("⚠️ Task not found");
                navigate("/tasks");
            }
        } catch (error) {
            console.error("❌ Error fetching task:", error);
        }
    };

    // Fetch comments in real time
    const commentsRef = ref(db, `tasks/${id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
        if (snapshot.exists()) {
            const commentsData = snapshot.val();
            const commentsList = Object.values(commentsData);
            setComments(commentsList);
        } else {
            setComments([]); // No comments
        }
    });

    fetchTask();

    return () => unsubscribe(); // Cleanup Firebase listener
}, [id, navigate]);

    const handleSaveEdit = async () => {
        try {
            await updateTaskInFirebase(editedTask.id, editedTask);
            setTask(editedTask); // Update local state
            setIsEditing(false);
            console.log("✅ Task updated successfully in Firebase");
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    };

    const handleDeleteTask = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        navigate("/tasks");
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
                    users={task.assignedTo || []} 
                />

                <TaskComments 
                    taskId={task?.id}
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
