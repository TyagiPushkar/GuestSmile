import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../assets/css/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [visitData, setVisitData] = useState({
    TotalVisits: 0,
    VisitorsIn: 0,
    VisitorsExited: 0,
    VisitorDetails: [],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  useEffect(() => {
    setGreeting(getGreeting());
    fetch('https://namami-infotech.com/GuestSmile/src/dashboard/dashboard.php?TenantId=1')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') setVisitData(data.data);
      })
      .catch((error) => console.error('Error fetching visit data:', error));
  }, []);

  const pieChartData = {
    labels: ['Visitors In', 'Visitors Exited'],
    datasets: [
      {
        data: [visitData.VisitorsIn, visitData.VisitorsExited],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e57373'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* <div className="dashboard-header">
        <h1>{greeting}</h1>
      </div> */}

      <div className="dashboard-content">
        <div className="statistics-section">
          <h3>Visitor Stats</h3>
          <div className="statistics-headings" style={{display:"flex", justifyContent:"space-between"}}>
            <div className="stat-item">
              <h4 style={{textAlign:"center"}}>Total Visits</h4>
              <p style={{textAlign:"center"}}>{visitData.TotalVisits}</p>
            </div>
            <div className="stat-item">
              <h4 style={{textAlign:"center"}}>Visitors In</h4>
              <p style={{textAlign:"center"}}>{visitData.VisitorsIn}</p>
            </div>
            <div className="stat-item">
              <h4 style={{textAlign:"center"}}>Visitors Exited</h4>
              <p style={{textAlign:"center"}}>{visitData.VisitorsExited}</p>
            </div>
          </div>
          <div className="pie-chart-container">
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="recent-visit-section">
          <h3>Recent Visits</h3>
          <table className="recent-visits-table">
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Phone No.</th>
                <th>Meeting Person</th>
                <th>Check-In Time</th>
                <th>Exit Time</th>
                
              </tr>
            </thead>
            <tbody>
              {visitData.VisitorDetails.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.VisitorName}</td>
                  <td>{visit.Mobile}</td>
                  <td>{visit.MeetingPerson}</td>
                  <td>{new Date(visit.InTime).toLocaleTimeString()}</td>
                  <td style={{ color: visit.ExitTime ? 'black' : 'red' }}>
                    {visit.ExitTime
                      ? new Date(visit.ExitTime).toLocaleTimeString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
