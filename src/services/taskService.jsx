import axios from "axios";
import { ref, push } from "firebase/database";
import { db } from "../firebase"; // ✅ Import Firebase Realtime Database

const FIREBASE_URL = "https://task-manager-najjar-default-rtdb.firebaseio.com/tasks.json";

/**
 * Add a new task to Firebase Realtime Database.
 * @param {Object} task - Task object to be added.
 * @returns {Promise<string>} - Task ID
 */
export const addTaskToFirebase = async (task) => {
    try {
        const tasksRef = ref(db, "tasks");
        console.log("📌 Sending to Firebase:", task); // ✅ Debugging log
        const newTaskRef = await push(tasksRef, task);
        return newTaskRef.key;
    } catch (error) {
        console.error("❌ Error adding task to Firebase:", error);
        throw error;
    }
};


/**
 * Get all tasks from Firebase Realtime Database.
 * @returns {Promise<Array>} - List of tasks.
 */
export const getTasksFromFirebase = async () => {
    try {
        const response = await axios.get(FIREBASE_URL);

        if (!response.data) return [];

        return Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
        }));
    } catch (error) {
        console.error("❌ Error fetching tasks from Firebase:", error);
        throw error;
    }
};

/**
 * Delete a task from Firebase.
 * @param {string} taskId - Task ID to delete.
 */
export const deleteTaskFromFirebase = async (taskId) => {
    try {
        await axios.delete(`https://task-manager-najjar-default-rtdb.firebaseio.com/tasks/${taskId}.json`);
    } catch (error) {
        console.error("❌ Error deleting task from Firebase:", error);
        throw error;
    }
};
