import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const workDeadlines = [
  { id: 1, task: "Submit final CRM report", deadline: "March 18, 2025" },
  { id: 2, task: "Launch marketing campaign", deadline: "March 22, 2025" },
  { id: 3, task: "Database security audit", deadline: "March 28, 2025" }
];

const WorkDeadlines = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaExclamationTriangle className="mr-2 text-orange-500" /> Work Deadlines
      </h2>
      <ul>
        {workDeadlines.map((work) => (
          <li key={work.id} className="py-2 border-b last:border-none flex justify-between items-center">
            <span className="text-gray-700 font-semibold">{work.task}</span>
            <span className="text-gray-500">{work.deadline}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkDeadlines;
