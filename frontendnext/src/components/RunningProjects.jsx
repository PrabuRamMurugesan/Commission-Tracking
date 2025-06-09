import React from "react";
import { FaTasks, FaCheckCircle } from "react-icons/fa";

const projects = [
  { id: 1, name: "CRM Dashboard Development", progress: 80 },
  { id: 2, name: "AI Predictive Analytics Integration", progress: 60 },
  { id: 3, name: "User Management Module", progress: 90 },
  { id: 4, name: "Security & Compliance Updates", progress: 50 }
];

const RunningProjects = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaTasks className="mr-2 text-blue-500" /> Running Projects
      </h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="py-2 border-b last:border-none flex justify-between items-center">
            <span className="text-gray-700 font-semibold">{project.name}</span>
            <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            {project.progress === 100 ? <FaCheckCircle className="text-green-500" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunningProjects;
