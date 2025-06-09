
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Calendar</h2>
      <Calendar onChange={setDate} value={date} className="w-full" />
      <p className="mt-4 text-gray-600">Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarWidget;
