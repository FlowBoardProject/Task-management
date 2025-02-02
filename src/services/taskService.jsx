import { ref, push, get, child, update } from "firebase/database";
import { db } from "../firebase"; 

const TASKS_PATH = "tasks";

/**
 * Add a new task to Firebase.
 * @param {Object} task - Task object to be added.
 * @returns {Promise<string>} - Task ID
 */
export const addTaskToFirebase = async (task) => {
    try {
        const tasksRef = ref(db, TASKS_PATH);
        console.log("📌 Sending to Firebase:", task); 
        const newTaskRef = await push(tasksRef, task);
        return newTaskRef.key;
    } catch (error) {
        console.error("❌ Error adding task to Firebase:", error);
        throw error;
    }
};

/**
 * Fetch all tasks from Firebase.
 * @returns {Promise<Array>} - List of tasks.
 */
export const getTasksFromFirebase = async () => {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, TASKS_PATH));

        if (!snapshot.exists()) return [];

        const tasksData = snapshot.val();
        return Object.entries(tasksData).map(([id, task]) => ({
            id,
            ...task,
        }));
    } catch (error) {
        console.error("❌ Error fetching tasks from Firebase:", error);
        throw error;
    }
};

/**
 * Update the status of a task in Firebase.
 * @param {string} taskId - The task ID.
 * @param {string} newStatus - The new status (todo, in-progress, done).
 */
export const updateTaskStatusInFirebase = async (taskId, newStatus) => {
    try {
        if (typeof newStatus !== "string") {
            console.error("❌ Error: newStatus is not a string", newStatus);
            return;
        }

        const taskRef = ref(db, `tasks/${taskId}`);
        await update(taskRef, { status: newStatus });
        console.log(`✅ Task ${taskId} updated to status: ${newStatus}`);
    } catch (error) {
        console.error("❌ Error updating task status:", error);
    }
};


export const updateTaskInFirebase = async (taskId, updatedTask) => {
    try {
        const taskRef = ref(db, `tasks/${taskId}`);
        await update(taskRef, updatedTask);
        console.log(`✅ Task ${taskId} updated successfully in Firebase`);
    } catch (error) {
        console.error("❌ Error updating task in Firebase:", error);
        throw error;
    }
};

/**
 * Add a comment to a specific task in Firebase.
 * @param {string} taskId - The ID of the task to add a comment to.
 * @param {Object} comment - The comment object.
 */
export const addCommentToFirebase = async (taskId, comment) => {
    try {
        const commentsRef = ref(db, `${TASKS_PATH}/${taskId}/comments`);
        await push(commentsRef, comment);
        console.log(`✅ Comment added to task ${taskId}`);
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        throw error;
    }
};

/**
 * Fetch comments for a specific task.
 * @param {string} taskId - The task ID.
 * @returns {Promise<Array>} - List of comments.
 */
export const getCommentsFromFirebase = async (taskId) => {
    try {
        const taskRef = ref(db, `${TASKS_PATH}/${taskId}/comments`);
        const snapshot = await get(taskRef);
        
        if (!snapshot.exists()) return [];

        const commentsData = snapshot.val();
        return Object.entries(commentsData).map(([id, comment]) => ({
            id,
            ...comment,
        }));
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        throw error;
    }
};