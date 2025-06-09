import React, { useEffect, useState } from "react";
import { FaUsers, FaUserShield, FaDollarSign, FaProjectDiagram } from "react-icons/fa";
import { fetchWidgets } from "../services/dashboardService.js";

const DashboardWidgets = () => {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    fetchWidgets()
      .then((res) => setWidgets(res.data.data))
      .catch((err) => console.error("Error fetching widgets", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {widgets.map((widget) => (
        <div key={widget.id} className={`p-4 ${widget.bgColor} rounded-lg shadow-md flex items-center justify-between`}>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">{widget.title}</h2>
            <p className="text-2xl font-bold text-gray-800">{widget.count}</p>
          </div>
          {widget.icon}
        </div>
      ))}
    </div>
  );
};

export default DashboardWidgets;
