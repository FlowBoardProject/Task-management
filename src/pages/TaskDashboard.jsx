import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Swal from "sweetalert2";

export default function TaskDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Handle form submission
  const handleAddTask = async (task) => {
    try {
      await push(ref(db, "tasksMember"), {
        ...task,
        assignedTo: user.uid,
        createdAt: new Date().toISOString(),
        status: "Pending",
      });
      Swal.fire({
        title: "Success!",
        text: "Task added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add task. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Task Dashboard</h1>
        {/* Pass handleAddTask as onSubmit */}
        <TaskForm onSubmit={handleAddTask} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
