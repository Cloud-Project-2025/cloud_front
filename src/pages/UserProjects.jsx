// src/pages/UserProjects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { mockProjects } from "../mock/mockData.js";
// import { getUserProjects } from "../services/projectService"; // 실제 서비스 예시

export default function UserProjects() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [allProjects, setAllProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!user) return;

    // ✅ 실제 서비스 예시 (백엔드에서 현재 유저의 프로젝트만 가져오기)
    /*
    setLoading(true);
    getUserProjects(user.id)
      .then((res) => {
        const list = res.data || [];
        setAllProjects(list);
        setVisibleProjects(list);
      })
      .catch((err) => {
        console.error("getUserProjects 실패, mock으로 대체:", err);
        const mine = mockProjects.filter(
          (p) => p.ownerEmail === user.email // 또는 p.author 등
        );
        setAllProjects(mine);
        setVisibleProjects(mine);
      })
      .finally(() => setLoading(false));
    */

    // ✅ 더미 테스트 (현재 사용 중)
    const mine = mockProjects.filter((p) => p.ownerEmail === user.email);
    setAllProjects(mine);
    setVisibleProjects(mine);
  }, [user]);

  const handleApplyFilters = (filters) => {
    setLoading(true);
    try {
      const next = applyFilters(allProjects, filters);
      setVisibleProjects(next);
      setSelectedIds((prev) =>
        prev.filter((id) => next.some((p) => p.id === id))
      );
    } catch (e) {
      console.error(e);
      setVisibleProjects([]);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = visibleProjects.map((p) => p.id);
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
    if (!window.confirm(`${selectedIds.length}개 프로젝트를 삭제할까요? (더미)`))
      return;

    const leftAll = allProjects.filter((p) => !selectedIds.includes(p.id));
    const leftVisible = visibleProjects.filter(
      (p) => !selectedIds.includes(p.id)
    );

    setAllProjects(leftAll);
    setVisibleProjects(leftVisible);
    setSelectedIds([]);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* 오른쪽 필터 카드 */}
      <aside className="w-[280px] shrink-0 order-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
          <FilterSidebar onApply={handleApplyFilters} />
        </div>
      </aside>

      {/* 왼쪽 My Projects 카드 */}
      <section className="flex-1 space-y-3 order-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 mb-2 flex items-center justify-between">
          {/* 로그인한 사용자 이메일 표시 */}
          <h2 className="text-lg font-semibold">
            {user ? `${user.email} 님의 프로젝트` : "My Projects Management"}
    </h2>

    <div className="flex items-center gap-3 text-sm text-slate-600">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                onChange={toggleAllVisible}
                checked={
                  visibleProjects.length > 0 &&
                  visibleProjects.every((p) => selectedIds.includes(p.id))
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

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : visibleProjects.length ? (
          visibleProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-stretch gap-2 border-b border-transparent"
            >
              <div className="flex items-center px-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(project.id)}
                  onChange={() => toggleOne(project.id)}
                />
              </div>
              <div className="flex-1">
                <ProjectCard
                  project={project}
                  onClick={() => nav(`/projects/${project.id}`)} // 상세보기로 이동
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 mt-4">No projects found.</p>
        )}
      </section>
    </main>
  );
}

function applyFilters(list, filters) {
  if (!filters || !Object.keys(filters).length) return list;
  let result = [...list];

  const regions = filters["국가/지역"];
  if (regions && regions.length) {
    result = result.filter((p) => regions.includes(p.country_region));
  }

  const statusArr = filters["진행 상태"] || filters["진행상태"];
  if (statusArr && statusArr.length) {
    result = result.filter((p) => statusArr.includes(p.status));
  }

  return result;
}
