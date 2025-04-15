import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Calendar, Book, Users, Award, Clock, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({
    timestamp: '',
    sessions: []
  });
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when component mounts
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/dashboard-data');
      const data = await response.json();
      setAttendanceData(data.attendance);
      setTimetableData(data.timetable);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="text-green-500" />;
      case 'Absent':
        return <XCircle className="text-red-500" />;
      default:
        return <AlertCircle className="text-yellow-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const stats = [
    {
      title: 'Upcoming Classes',
      value: '3',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      title: 'Assignments Due',
      value: '2',
      icon: Book,
      color: 'text-green-500'
    },
    {
      title: 'Study Groups',
      value: '4',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Achievement Points',
      value: '850',
      icon: Award,
      color: 'text-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your academic journey today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Attendance Section */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Calendar className="mr-2 text-primary" />
          <h2 className="text-2xl font-semibold">Today's Attendance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {attendanceData.sessions.map((status, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Session {index + 1}
                  </p>
                  <p className="font-semibold">{status}</p>
                </div>
                {getAttendanceIcon(status)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {attendanceData.timestamp}
        </p>
      </section>

      {/* Timetable Section */}
      <section>
        <div className="flex items-center mb-4">
          <Clock className="mr-2 text-primary" />
          <h2 className="text-2xl font-semibold">Weekly Timetable</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {timetableData.map((day, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                {day.header}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {day.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="p-4 text-sm whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard; 