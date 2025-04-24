"use client"

// import React, { useState } from 'react';

// // This component includes all styling with Tailwind CSS classes
// const Timetable = () => {
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('attendance');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:3000/api/update-dashboard', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ mobile_number: mobileNumber }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch data');
//       }

//       const data = await response.json();
//       setResult(data); // Store the scraped data
//     } catch (err) {
//       setError(err.message || 'An unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     if (status?.toLowerCase().includes('present')) {
//       return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 text-white">Present</span>;
//     } else if (status?.toLowerCase().includes('absent')) {
//       return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">Absent</span>;
//     } else {
//       return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500 text-white">{status}</span>;
//     }
//   };

//   const getSessionStatus = (status) => {
//     if (status?.toLowerCase().includes('present')) {
//       return (
//         <span className="flex items-center text-green-500">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//             <polyline points="22 4 12 14.01 9 11.01"></polyline>
//           </svg>
//           {status}
//         </span>
//       );
//     } else if (status?.toLowerCase().includes('absent')) {
//       return (
//         <span className="flex items-center text-red-500">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//             <circle cx="12" cy="12" r="10"></circle>
//             <line x1="15" y1="9" x2="9" y2="15"></line>
//             <line x1="9" y1="9" x2="15" y2="15"></line>
//           </svg>
//           {status}
//         </span>
//       );
//     } else {
//       return (
//         <span className="flex items-center text-gray-500">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//             <circle cx="12" cy="12" r="10"></circle>
//             <polyline points="12 6 12 12 16 14"></polyline>
//           </svg>
//           {status}
//         </span>
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Input Form */}
//         <div className="max-w-md mx-auto mb-8 bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="p-4 border-b">
//             <h2 className="text-xl font-semibold text-cyan-700">KMIT Netra Data</h2>
//             <p className="text-sm text-gray-500">Enter your mobile number to fetch your timetable and attendance</p>
//           </div>
//           <div className="p-4">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   id="mobileNumber"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   placeholder="Enter your mobile number"
//                   required
//                   className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`px-4 py-2 rounded-md bg-cyan-700 text-white flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-800'}`}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Fetching...
//                     </>
//                   ) : (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                         <line x1="22" y1="2" x2="11" y2="13"></line>
//                         <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                       </svg>
//                       Fetch Data
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//           {error && (
//             <div className="px-4 pb-4">
//               <div className="w-full p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
//                   <circle cx="12" cy="12" r="10"></circle>
//                   <line x1="12" y1="8" x2="12" y2="12"></line>
//                   <line x1="12" y1="16" x2="12.01" y2="16"></line>
//                 </svg>
//                 <p className="text-sm">{error}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="space-y-8">
//             {/* Tabs */}
//             <div className="w-full">
//               <div className="grid w-full grid-cols-3 mb-6 bg-white rounded-lg p-1 shadow-sm">
//                 <button
//                   onClick={() => setActiveTab('attendance')}
//                   className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'attendance' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                     <line x1="16" y1="2" x2="16" y2="6"></line>
//                     <line x1="8" y1="2" x2="8" y2="6"></line>
//                     <line x1="3" y1="10" x2="21" y2="10"></line>
//                   </svg>
//                   Attendance
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('today')}
//                   className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'today' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <polyline points="12 6 12 12 16 14"></polyline>
//                   </svg>
//                   Today's Sessions
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('timetable')}
//                   className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'timetable' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                     <line x1="16" y1="2" x2="16" y2="6"></line>
//                     <line x1="8" y1="2" x2="8" y2="6"></line>
//                     <line x1="3" y1="10" x2="21" y2="10"></line>
//                   </svg>
//                   Weekly Timetable
//                 </button>
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'attendance' && (
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                   <div className="p-4 border-b">
//                     <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                         <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                         <line x1="16" y1="2" x2="16" y2="6"></line>
//                         <line x1="8" y1="2" x2="8" y2="6"></line>
//                         <line x1="3" y1="10" x2="21" y2="10"></line>
//                       </svg>
//                       Overall Attendance
//                     </h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="rounded-lg border overflow-hidden">
//                       <div className="overflow-x-auto">
//                         <table className="w-full">
//                           <thead>
//                             <tr className="bg-cyan-50">
//                               <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Date</th>
//                               <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Subject</th>
//                               <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Status</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y">
//                             {result.attendance?.map((row, index) => (
//                               <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                                 <td className="px-4 py-3 text-sm text-gray-700">{row[0]}</td>
//                                 <td className="px-4 py-3 text-sm text-gray-700">{row[1]}</td>
//                                 <td className="px-4 py-3 text-sm">{getStatusBadge(row[2])}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'today' && (
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                   <div className="p-4 border-b">
//                     <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                         <circle cx="12" cy="12" r="10"></circle>
//                         <polyline points="12 6 12 12 16 14"></polyline>
//                       </svg>
//                       Today's Sessions
//                     </h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="grid gap-3">
//                       {result.sessions?.map((status, index) => (
//                         <div key={index} className="p-3 rounded-lg border bg-white">
//                           <div className="flex justify-between items-center">
//                             <span className="font-medium">Session {index + 1}</span>
//                             {getSessionStatus(status)}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'timetable' && (
//                 <div className="space-y-6">
//                   {result.timetable?.map((day, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
//                       <div className="p-4 border-b">
//                         <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                             <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                             <line x1="16" y1="2" x2="16" y2="6"></line>
//                             <line x1="8" y1="2" x2="8" y2="6"></line>
//                             <line x1="3" y1="10" x2="21" y2="10"></line>
//                           </svg>
//                           {day.header}
//                         </h3>
//                       </div>
//                       <div className="p-4">
//                         <div className="rounded-lg border overflow-hidden">
//                           <div className="overflow-x-auto">
//                             <table className="w-full">
//                               <thead>
//                                 <tr className="bg-cyan-50">
//                                   <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Time</th>
//                                   <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Subject</th>
//                                   <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Room</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y">
//                                 {day.rows.map((row, i) => (
//                                   <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                                     <td className="px-4 py-3 text-sm text-gray-700">{row[0]}</td>
//                                     <td className="px-4 py-3 text-sm font-medium">{row[1]}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-700">{row[2]}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Timetable;

import React, { useState } from 'react';

const Timetable = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/update-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      setResult(data); // Store the scraped data
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getSessionStatus = (status) => {
    if (status?.toLowerCase().includes('present')) {
      return (
        <span className="flex items-center text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {status}
        </span>
      );
    } else if (status?.toLowerCase().includes('absent')) {
      return (
        <span className="flex items-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {status}
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {status}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="max-w-md mx-auto mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-cyan-700">KMIT Netra Data</h2>
            <p className="text-sm text-gray-500">Enter your mobile number to fetch your timetable and attendance</p>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md bg-cyan-700 text-white flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-800'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Fetch Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {error && (
            <div className="px-4 pb-4">
              <div className="w-full p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="w-full">
              <div className="grid w-full grid-cols-3 mb-6 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'attendance' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'today' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Today's Sessions
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md ${activeTab === 'timetable' ? 'bg-cyan-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Weekly Timetable
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'attendance' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Overall Attendance
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="rounded-lg border overflow-hidden bg-gradient-to-r from-cyan-100 to-blue-100 p-6 flex items-center justify-between">
                      <div>
                        <h4 className="text-2xl font-bold text-cyan-700">{result.overall_attendance_percentage}%</h4>
                        <p className="text-sm text-gray-600">Overall Attendance Percentage</p>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-700">
                          <path d="M22 12A10 10 0 0 1 2 12"></path>
                          <circle cx="12" cy="12" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'today' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Today's Sessions
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid gap-3">
                      {result.sessions?.map((status, index) => (
                        <div key={index} className="p-3 rounded-lg border bg-white">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Session {index + 1}</span>
                            {getSessionStatus(status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timetable' && (
                <div className="space-y-6">
                  {result.timetable?.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-cyan-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {day.header}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="rounded-lg border overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-cyan-50">
                                  <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Time</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-cyan-900">Subject</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {day.rows.map((row, i) => (
                                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-3 text-sm text-gray-700">{row[0]}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{row[1]}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Timetable;