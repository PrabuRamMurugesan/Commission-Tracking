import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const upcomingEvents = [
  { id: 1, title: "Team Meeting", date: "March 15, 2025" },
  { id: 2, title: "Product Launch", date: "April 10, 2025" },
  { id: 3, title: "Quarterly Review", date: "May 5, 2025" }
];

const UpcomingEvents = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaCalendarAlt className="mr-2 text-purple-500" /> Upcoming Events
      </h2>
      <ul>
        {upcomingEvents.map((event) => (
          <li key={event.id} className="py-2 border-b last:border-none flex justify-between items-center">
            <span className="text-gray-700 font-semibold">{event.title}</span>
            <span className="text-gray-500">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
