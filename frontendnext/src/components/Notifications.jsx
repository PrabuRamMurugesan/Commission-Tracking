import React from "react";
import { FaBell } from "react-icons/fa";

const notifications = [
  { id: 1, message: "New client registered", time: "2 mins ago" },
  { id: 2, message: "Invoice #12345 has been paid", time: "10 mins ago" },
  { id: 3, message: "Project deadline approaching", time: "1 hour ago" },
  { id: 4, message: "New message from support", time: "3 hours ago" }
];

const Notifications = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaBell className="mr-2 text-yellow-500" /> Notifications
      </h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id} className="py-2 border-b last:border-none text-gray-700">
            <span className="font-semibold">{notif.message}</span>
            <p className="text-sm text-gray-500">{notif.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
