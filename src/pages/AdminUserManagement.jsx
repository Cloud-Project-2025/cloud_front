// src/pages/AdminUserManagement.jsx
import { useState, useEffect } from "react";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  
  const fetchUsers = async () => {
    // 유저 목록을 서버에서 가져오는 로직
    const data = await fetchUsersFromAPI();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold">User Management</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">Role</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border-b p-2">{user.email}</td>
              <td className="border-b p-2">{user.role}</td>
              <td className="border-b p-2">
                <button onClick={() => {}} className="text-red-500 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
