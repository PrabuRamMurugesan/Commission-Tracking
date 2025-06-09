import React from "react";
import { FaBullhorn } from "react-icons/fa";

const workAnnouncements = [
  { id: 1, announcement: "New CRM update will be deployed next week." },
  { id: 2, announcement: "Company-wide meeting scheduled for March 20, 2025." },
  { id: 3, announcement: "Security protocol changes effective from April 1, 2025." }
];

const WorksAnnouncements = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaBullhorn className="mr-2 text-blue-500" /> Work Announcements
      </h2>
      <ul>
        {workAnnouncements.map((announcement) => (
          <li key={announcement.id} className="py-2 border-b last:border-none text-gray-700">
            {announcement.announcement}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorksAnnouncements;
