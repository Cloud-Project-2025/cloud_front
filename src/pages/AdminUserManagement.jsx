// src/pages/AdminUserManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers, mockProjects } from "../mock/mockData.js";
// 실제 서비스 예시 API (백엔드 붙일 때 사용)
// import { getAllUsers } from "../services/adminService";

export default function AdminUserManagement() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // ✅ 페이지네이션
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ 더미 테스트: 유저별 작성 프로젝트 수 계산
  const usersWithCounts = useMemo(() => {
    return mockUsers.map((u) => {
      const posts = mockProjects.filter((p) => p.ownerEmail === u.email).length;
      return { ...u, totalPosts: posts };
    });
  }, []);

  // 처음 로드시 더미 유저 세팅
  useEffect(() => {
    // ✅ 실제 서비스용 (백엔드 붙일 때)
    /*
    getAllUsers()
      .then((res) => {
        const list = res.data || [];
        // totalPosts는 백엔드에서 내려주거나, 여기서 다시 계산 가능
        setUsers(list);
      })
      .catch((err) => {
        console.error("getAllUsers error:", err);
        setUsers([]);
      });
    */

    // ✅ 현재는 mockUsers 사용
    setUsers(usersWithCounts);
    setPage(1);
  }, [usersWithCounts]);

  const toggleAllVisible = () => {
    if (
      users.length > 0 &&
      users.every((u) => selectedIds.includes(u.id))
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    console.log("삭제할 유저 ID:", selectedIds);
    alert(
      `시연용: 실제 삭제는 하지 않고,\n선택된 유저 ID: [${selectedIds.join(
        ", ",
      )}] 를 서버에 보낸다고 가정합니다.`,
    );
  };

  // ✅ 페이지네이션 계산
  const totalCount = users.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Admin - User Management</h1>
          <p className="text-xs text-gray-500">
            eco-db 서비스 사용자 계정 및 작성 프로젝트 수를 관리합니다.
          </p>
          <button
            type="button"
            className="mt-1 text-[11px] text-indigo-600 hover:underline"
            onClick={() => nav("/admin/projects")}
          >
            &lt; Back to Projects
          </button>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm text-slate-700">
          <div>
            총{" "}
            <span className="font-semibold text-indigo-600">
              {totalCount}
            </span>{" "}
            명 사용자
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                onChange={toggleAllVisible}
                checked={
                  users.length > 0 &&
                  users.every((u) => selectedIds.includes(u.id))
                }
              />
              <span>{selectedIds.length} selected</span>
            </label>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 rounded-full bg-red-500 text-white text-xs shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className="flex items-center justify-end gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2">
          <span className="text-xs text-slate-500">페이지 당</span>
          <select
            className="border rounded-md px-2 py-1 text-xs"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            className="px-2 py-1 border rounded-full disabled:opacity-40"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="px-2 py-1 border rounded-full disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            다음
          </button>
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
        <div className="px-4 border-b border-gray-200 py-2 bg-gray-50 text-sm font-medium">
          사용자 목록
        </div>
        <div className="px-4 border border-gray-300 border-t-0 rounded-b-xl bg-white">
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
                <th className="border-b p-2 w-32 text-right">
                  Total Projects
                </th>
                <th className="border-b p-2 w-32 text-center">Role</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.length ? (
                pagedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border-b p-2 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleOne(u.id)}
                      />
                    </td>
                    <td className="border-b p-2 align-middle text-xs">
                      {u.email}
                    </td>
                    <td className="border-b p-2 align-middle text-right text-xs">
                      {u.totalPosts}
                    </td>
                    <td className="border-b p-2 align-middle text-center text-xs uppercase">
                      {u.role}
                    </td>
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
    </div>
  );
}
