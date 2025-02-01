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


