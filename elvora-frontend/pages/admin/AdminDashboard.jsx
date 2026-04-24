// import { useEffect, useState } from 'react';
// import { api } from '../../utils/api';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
  
//   useEffect(() => { api('/admin/dashboard', { admin: true }).then(setStats); }, []);
//   if (!stats) return <div>Loading...</div>;
  
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const { adminToken } = useAdmin(); // 🔥 IMPORTANT

  useEffect(() => {
    if (!adminToken) return; // 🛑 wait for token

    api('/admin/dashboard', { admin: true })
      .then(setStats)
      .catch(err => {
        console.error("❌ Dashboard Error:", err.message);
      });
  }, [adminToken]); // 🔥 dependency

  if (!stats) return <div>Loading...</div>;
  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-primary' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue}`, color: 'bg-accent' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-secondary' },
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-purple-500' },
    { label: 'Total Products', value: stats.totalProducts, color: 'bg-pink-500' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className={`${c.color} text-white p-4 rounded shadow`}>
            <div className="text-sm">{c.label}</div>
            <div className="text-2xl font-bold mt-2">{c.value}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-3">Recent Orders</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Order #</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map(o => (
              <tr key={o._id} className="border-b">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2">{o.user?.name}</td>
                <td className="p-2">Rs. {o.totalPrice}</td>
                <td className="p-2">{o.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}