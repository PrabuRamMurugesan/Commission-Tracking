import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DashboardWidgets from "../../components/DashboardWidgets";
import ChartOverview from "../../components/ChartOverview";
import CalendarWidget from "../../components/CalendarWidget";
import Notifications from "../../components/Notifications";
import TaskList from "../../components/TaskList";
import RunningProjects from "../../components/RunningProjects";
import UpcomingEvents from "../../components/UpcomingEvents";
import PendingWorks from "../../components/PendingWorks";
import WorkDeadlines from "../../components/WorkDeadlines";
import WorksAnnouncements from "../../components/WorksAnnouncements";
import NoticeBoard from "../../components/NoticeBoard";
import EarningsExpensesChart from "../../components/EarningsExpensesChart";
import WeeklyEarningsChart from "../../components/WeeklyEarningsChart";
import OlaMap from "../../components/OlaMap";
import "../../assets/styles/animations.css";
const Dashboard = () => {
  const navigate = useNavigate();


const fetchDashboardData = async () => {
    try {
        const statsResponse = await axios.get("/api/dashboard/stats");
        setStats(statsResponse.data);
    } catch (error) {
        console.error("Error fetching dashboard data", error);
    }
};


  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login"); 
    }
  }, [navigate]);  // ✅ Fix: Add `navigate` as a dependency
  


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className=" .sidebar-dashboard  flex flex-1 h-vh">
        <Sidebar />
        <main className="p-6 overflow-auto animate-fade-in w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-slide-down">CRM Admin Dashboard</h1>
          <DashboardWidgets />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left Side (Main Content) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <UpcomingEvents />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <RunningProjects />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <PendingWorks />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <WorkDeadlines />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <WorksAnnouncements />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <NoticeBoard />
              </div>
            </div>
            {/* Right Side (Widgets & Charts) */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <Notifications />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <TaskList />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <ChartOverview />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <CalendarWidget />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <EarningsExpensesChart />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <WeeklyEarningsChart />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in hover:shadow-xl transition">
                <OlaMap />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      
    <style>
      {`
      .sidebar-dashboard {
      height: 100%;
  color: white;
  padding: 20px;
}
`}
    </style>
    </div>

  );
};

export default Dashboard;




const fetchDashboardData = async () => {
  try {
      const statsResponse = await axios.get("/api/dashboard/stats");
      setStats(statsResponse.data);
  } catch (error) {
      console.error("Error fetching dashboard data", error);
  }
};