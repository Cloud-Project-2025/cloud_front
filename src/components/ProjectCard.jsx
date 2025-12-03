// src/components/ProjectCard.jsx

export default function ProjectCard({ project, onClick }) {
  const title =
    project.title || project.name || project.project_name || "proj name";
  const description =
    project.description ||
    project.project_description ||
    "프로젝트 설명이 없습니다.";

  const id = project.id || project.project_id || "N/A";
  const region = project.country_region || project.region || "N/A";
  const institution = project.institution || project.agency || "N/A";
  const status = project.status || "N/A";

  const statusColor =
    status === "진행 중"
      ? "text-amber-500"
      : status === "완료"
      ? "text-emerald-500"
      : status === "예정"
      ? "text-sky-500"
      : "text-slate-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left group"
    >
      <article className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4 min-w-0">
          {/* 왼쪽: 텍스트 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-indigo-700 mb-1 group-hover:text-indigo-800 truncate">
              {title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {description}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>ID: {id}</span>
              <span>지역: {region}</span>
              <span>기관: {institution}</span>
            </div>
          </div>

          {/* 오른쪽: status */}
          <div className="text-right text-xs shrink-0">
            <span className="block text-slate-400 mb-1">status</span>
            <span className={`font-semibold ${statusColor}`}>{status}</span>
          </div>
        </div>
      </article>
    </button>
  );
}
