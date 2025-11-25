// src/pages/AdminUserManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers, mockProjects } from "../mock/mockData.js";

export default function AdminUserManagement() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);

  // 유저별 작성 프로젝트 수 계산
  const usersWithCounts = useMemo(() => {
    return mockUsers.map((u) => {
      const posts = mockProjects.filter((p) => p.ownerEmail === u.email).length;
      return { ...u, totalPosts: posts };
    });
  }, []);

  // 처음 로드시 더미 유저 세팅
  useEffect(() => {
    setUsers(usersWithCounts);
  }, [usersWithCounts]);

  // 선택된 유저 id 목록
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = users.map((u) => u.id);
    const allSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`${selectedIds.length}명 유저를 삭제할까요? (더미)`)) return;

    const leftUsers = users.filter((u) => !selectedIds.includes(u.id));
    setUsers(leftUsers);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 상단 타이틀 + Projects Management 링크 */}
      <div className="flex items-center justify-between bg-[#D9D9D9] px-6 py-3 mb-2">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          type="button"
          onClick={() => nav("/admin/projects")}
          className="text-sm text-[#4D47C3] underline"
        >
          Projects Management &gt;
        </button>
      </div>

      {/* 선택 정보 바 */}
      <div className="flex items-center justify-between bg-gray-200 px-4 py-2 mb-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            onChange={toggleAllVisible}
            checked={
              users.length > 0 && users.every((u) => selectedIds.includes(u.id))
            }
          />
          <span className="text-sm">{selectedIds.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* 유저 테이블 */}
      <div className="px-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b p-2 w-10">
                <input
                  type="checkbox"
                  onChange={toggleAllVisible}
                  checked={
                    users.length > 0 &&
                    users.every((u) => selectedIds.includes(u.id))
                  }
                />
              </th>
              <th className="border-b p-2">Email</th>
              <th className="border-b p-2">Role</th>
              <th className="border-b p-2 text-right">Total Posts</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleOne(u.id)}
                    />
                  </td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2 text-right">{u.totalPosts}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-400 text-sm"
                >
                  No users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
