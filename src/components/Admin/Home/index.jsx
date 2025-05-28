import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Assuming you have a CSS file for styling

const AdminHome = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('/api/promotions');
        setPromotions(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-home">
      <h1>Admin Panel</h1>
      <h2>Promotions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion._id}>
              <td>{promotion._id}</td>
              <td>{promotion.name}</td>
              <td>{new Date(promotion.startDate).toLocaleDateString()}</td>
              <td>{new Date(promotion.endDate).toLocaleDateString()}</td>
              <td>{promotion.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;
