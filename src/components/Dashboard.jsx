import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    attendance: null,
    timetable: null,
    last_updated: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard-data');
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    }
  };

  const updateDashboard = async (mobileNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/update-dashboard', {
        mobile_number: mobileNumber
      });
      setDashboardData(response.data.data);
    } catch (err) {
      setError('Failed to update dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Today's Attendance</h2>
        {dashboardData.attendance ? (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 mb-2">Last updated: {dashboardData.attendance.timestamp}</p>
            <div className="grid grid-cols-4 gap-4">
              {dashboardData.attendance.sessions.map((session, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center ${
                    session === 'Present' ? 'bg-green-100 text-green-800' :
                    session === 'Absent' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  Session {index + 1}: {session}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No attendance data available</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Timetable</h2>
        {dashboardData.timetable ? (
          <div className="space-y-6">
            {dashboardData.timetable.map((day, index) => (
              <div key={index} className="bg-white rounded-lg shadow">
                <div className="bg-primary text-white p-3 rounded-t-lg">
                  <h3 className="text-lg font-semibold">{day.header}</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {day.rows[0].map((header, i) => (
                          <th key={i} className="text-left p-2">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {day.rows.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No timetable data available</p>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>Updating dashboard...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 