import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // تأكد من أن ملف firebase.js يحتوي على إعدادات قاعدة البيانات
import { ref, get } from "firebase/database";

const Cards = () => {
  const [cardList, setCardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // عدد العناصر التي ستظهر في البداية

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(db, "tasks"); // مسار قاعدة البيانات
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            assignedTo: data[key].assignedTo,
            priority: data[key].priority,
            title: data[key].title,
            description: data[key].description,
            createdBy: data[key].createdBy,
            deadline: data[key].deadline,
          }));
          setCardList(formattedData);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // وظيفة لإظهار المزيد من المهام
  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // إضافة 3 مهام إضافية
  };

  // وظيفة لإخفاء المهام
  const showLess = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 3, 3)); // تقليص 3 مهام ولكن لا تذهب لأقل من 3
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8"> Your Task </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {cardList.slice(0, visibleCount).map((task) => (
          <div
            key={task.id}
            className="max-w-md p-4 border rounded-lg shadow-lg bg-white"
          >
            <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Created By: <span className="text-gray-700">{task.createdBy}</span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Assigned To: <span className="text-gray-700">{task.assignedTo}</span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Deadline:{" "}
              <span className="text-gray-700">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Description: <span className="text-gray-700">{task.description}</span>
            </p>
            <p className="text-sm text-gray-500">
              Priority:{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full text-white ${
                  task.priority === "High"
                    ? "bg-red-500"
                    : task.priority === "Medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {task.priority}
              </span>
            </p>
          </div>
        ))}

        {visibleCount < cardList.length && (
          <button
            onClick={showMore}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Show more
          </button>
        )}

        {visibleCount > 3 && (
          <button
            onClick={showLess}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Show less
          </button>
        )}
      </div>
    </>
  );
};

export default Cards;
