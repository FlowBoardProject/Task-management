import React, { useState } from "react";
import html2canvas from "html2canvas";

function Articles() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen text-white">
      <h1 className="text-5xl font-extrabold text-center mb-12 uppercase drop-shadow-lg">
        📖 Article Hub
      </h1>

      <div className="bg-white text-gray-900 p-10 rounded-xl shadow-xl flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Explore, Learn, and Stay Informed
        </h2>
        <p className="text-gray-600 text-center max-w-2xl">
          Discover the latest insights, trends, and expert opinions in various
          fields. Stay updated with well-researched articles and organized
          content.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">Add Your Thoughts</h3>
        <input
          className="border-2 border-gray-300 p-3 w-full md:w-2/3 rounded-lg text-gray-800 focus:ring-4 focus:ring-purple-300"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Share your insights..."
        />
        <button
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all shadow-md"
          onClick={addTask}
        >
          ➕ Add Insight
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-white text-gray-900 shadow-lg rounded-lg p-6 border-l-8 border-purple-500"
          >
            <h3 className="text-xl font-bold text-gray-800">
              Article {index + 1}
            </h3>
            <p className="text-gray-600 mt-2">{task}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
