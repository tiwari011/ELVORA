// frontend/src/pages/admin/ManageUsers.jsx

import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function ManageUsers() {
  const { adminToken } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  
//   useEffect(() => {
//     fetchUsers();
//   }, []);
//   const fetchUsers = async () => {
//     try {
//       const data = await api('/admin/users', { token: adminToken });
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

  useEffect(() => {
    // Define function inside useEffect
    // const fetchUsers = async () => {
    //   try {
    //     const data = await api('/admin/users', { token: adminToken });
    //     setUsers(data);
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchUsers = async () => {
  try {
    const data = await api('/admin/users', { admin: true }); // ✅ FIXED
    
    console.log("✅ FRONTEND RECEIVED:", data);
    setUsers(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    fetchUsers();
  }, [adminToken]); // Only adminToken as dependency

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Addresses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {user.addresses?.length || 0} addresses
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {selectedUser.phone}
                </p>
              </div>

              <div>
                {/* <p className="text-sm text-gray-600 mb-2">Addresses ({selectedUser.addresses?.length || 0})</p>
                {selectedUser.addresses?.length > 0 ? ( */}
                <p className="text-sm text-gray-600 mb-2">
  Addresses ({Array.isArray(selectedUser.addresses) ? selectedUser.addresses.length : 0})
</p>

{Array.isArray(selectedUser.addresses) && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {/* {selectedUser.addresses.map((addr, idx) => ( */}
                    {Array.isArray(selectedUser.addresses) &&
 selectedUser.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className={`border p-4 rounded-lg ${
                          addr.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{addr.addressLine1}</p>
                            {addr.addressLine2 && <p className="text-sm">{addr.addressLine2}</p>}
                            <p className="text-sm">
                              {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">{addr.country || 'Nepal'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No addresses added</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="font-semibold">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}