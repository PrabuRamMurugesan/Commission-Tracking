import React from "react";
import { FaClipboardList } from "react-icons/fa";

const notices = [
  { id: 1, title: "System Maintenance", date: "March 15, 2025", content: "Scheduled maintenance from 12 AM to 4 AM." },
  { id: 2, title: "Policy Update", date: "March 18, 2025", content: "New work-from-home policies available on portal." },
  { id: 3, title: "Holiday Notice", date: "March 25, 2025", content: "Office will be closed for national holiday." }
];

const NoticeBoard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaClipboardList className="mr-2 text-green-500" /> Notice Board
      </h2>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id} className="py-2 border-b last:border-none">
            <h3 className="text-gray-800 font-semibold">{notice.title}</h3>
            <p className="text-gray-600 text-sm">{notice.date}</p>
            <p className="text-gray-700">{notice.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
