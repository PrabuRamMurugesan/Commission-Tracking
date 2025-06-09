import React from "react";
import { FaClock } from "react-icons/fa";

const pendingWorks = [
  { id: 1, task: "Finalize project documentation", dueDate: "March 20, 2025" },
  { id: 2, task: "Client feedback on design phase", dueDate: "March 22, 2025" },
  { id: 3, task: "Bug fixes in CRM module", dueDate: "March 25, 2025" }
];

const PendingWorks = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaClock className="mr-2 text-red-500" /> Pending Works
      </h2>
      <ul>
        {pendingWorks.map((work) => (
          <li key={work.id} className="py-2 border-b last:border-none flex justify-between items-center">
            <span className="text-gray-700 font-semibold">{work.task}</span>
            <span className="text-gray-500">{work.dueDate}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingWorks;
