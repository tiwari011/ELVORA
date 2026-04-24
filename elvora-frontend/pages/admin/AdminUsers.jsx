import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api('/admin/users', { admin: true }).then(setUsers); }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Registered</th>
              <th className="p-2 text-left">Addresses</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {u.addresses?.length || 0} addresses
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}