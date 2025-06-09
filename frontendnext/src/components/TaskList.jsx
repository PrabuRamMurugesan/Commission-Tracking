import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const initialTasks = [
  { id: 1, task: "Complete dashboard UI", completed: false },
  { id: 2, task: "Fix authentication issues", completed: true },
  { id: 3, task: "Integrate API for reports", completed: false },
  { id: 4, task: "Test notifications system", completed: true }
];

const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="py-2 border-b last:border-none flex justify-between items-center">
            <span className={`text-gray-700 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.task}</span>
            <button onClick={() => toggleTask(task.id)}>
              {task.completed ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
