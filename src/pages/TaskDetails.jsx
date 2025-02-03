import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { db } from "../firebase"; 
import { ref, get, update, onValue } from "firebase/database";
import { TaskHeader } from "../components/TaskHeader";
import { TaskActions } from "../components/TaskActions";
import { TaskInfo } from "../components/TaskInfo";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { TaskComments } from "../components/TaskComments";
import { updateTaskInFirebase } from "../services/taskService";
import { useAuth } from "../context/AuthContext"; // ✅ Import user authentication

export default function TaskDetails() {

    //  -------------------- State --------------
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userRole = user?.role || "user"; // "user" if role is missing

    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commenterName, setCommenterName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //  -------------------- State --------------


    //  --------------- Fetch Tasks --------------
    useEffect(() => {
        if (!id) return;
    
        const fetchTask = async () => {
            try {
                const taskRef = ref(db, `tasks/${id}`);
                const snapshot = await get(taskRef);
    
                if (snapshot.exists()) {
                    const taskData = snapshot.val();

                    if (taskData.deleted) {
                        console.warn("⚠️ Task is deleted, redirecting...");
                        navigate("/tasks");
                        return;
                    }
    
                    // ✅ Ensure assignedTo is formatted correctly
                    const formattedTask = {
                        ...taskData,
                        assignedTo: Array.isArray(taskData.assignedTo)
                            ? taskData.assignedTo.map(user => ({
                                id: user.id,
                                name: user.name || "Unknown User"
                            }))
                            : []
                    };
    
                    setTask({ id, ...formattedTask });
                    setEditedTask({ id, ...formattedTask });
                } else {
                    console.warn("⚠️ Task not found");
                    navigate("/tasks");
                }
            } catch (error) {
                console.error("❌ Error fetching task:", error);
            }
        };
    
        fetchTask();

        // ✅ Fetch comments in real-time
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

        return () => unsubscribe(); // Cleanup Firebase listener

    }, [id, navigate]);
    //  --------------- Fetch Tasks --------------


    const handleSaveEdit = async () => {
        if (userRole !== "manager") {
            console.warn("❌ Permission denied: Only managers can edit tasks.");
            return;
        }

        try {
            const formattedTask = {
                ...editedTask,
                assignedTo: editedTask.assignedTo.map(user => ({
                    id: user.id,
                    name: user.name
                })),
            };

            await updateTaskInFirebase(editedTask.id, formattedTask);
            setTask(editedTask);
            setIsEditing(false);
            console.log("✅ Task updated successfully in Firebase");
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (userRole !== "manager") {
            console.warn("❌ Permission denied: Only managers can delete tasks.");
            return;
        }
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (userRole !== "manager") {
            console.warn("❌ Permission denied: Only managers can delete tasks.");
            return;
        }

        try {
            // ✅ Ensure task exists before trying to delete
            if (!id || !task) {
                console.error("❌ Error: Task ID or task data is missing.");
                return;
            }
    
            const softDeletedTask = {
                ...task,
                deleted: true, // ✅ Mark task as deleted
                assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [] // ✅ Ensure assignedTo is an array
            };
    
            await updateTaskInFirebase(id, softDeletedTask);
            console.log(`✅ Task ${id} marked as deleted`);
            setShowDeleteModal(false);
            navigate("/tasks");
        } catch (error) {
            console.error("❌ Error marking task as deleted:", error);
        }
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
                
                {/* ✅ Show actions only for Managers */}
                {userRole === "manager" && (
                    <TaskActions 
                        isEditing={isEditing} 
                        onEditToggle={() => setIsEditing(!isEditing)} 
                        onSave={handleSaveEdit} 
                        onDelete={handleDeleteTask} 
                    />
                )}

                <TaskInfo 
                    isEditing={isEditing} 
                    task={editedTask} 
                    setTask={setEditedTask} 
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
