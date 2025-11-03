import { useParams, useNavigate } from "react-router-dom";
import { MOCK } from "../data/mock.js";
import Badge from "../components/Badge.jsx";
import StatusPanel from "../components/StatusPanel.jsx";

const tone = {
  PLANNED: "bg-gray-100 text-gray-700 border border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};
const readable = (s) =>
  s === "PLANNED" ? "Planned" : s === "IN_PROGRESS" ? "In progress" : "Completed";
const money = (n) =>
  n == null ? "-" : n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString() : "-");

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const p = MOCK.find((x) => String(x.id) === String(id));

  if (!p) return <div className="p-6">Project not found</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button className="text-sm text-gray-600 hover:underline" onClick={() => nav(-1)}>
        ← Back
      </button>

      <div className="mt-3">
        <h1 className="text-2xl font-bold leading-snug">{p.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
          <span className="text-gray-500">{p.external_id}</span>
          <Badge className={tone[p.status]}>{readable(p.status)}</Badge>
          <span>
            Financing: <b>{money(p.budget_usd)}</b>
          </span>
          {p.link_url && (
            <a className="text-indigo-600 hover:underline" href={p.link_url} target="_blank" rel="noreferrer">
              Official link
            </a>
          )}
        </div>
      </div>

      {p.description && <p className="mt-5 max-w-3xl text-gray-700">{p.description}</p>}

      <h2 className="mt-8 text-xl font-semibold">Project Details</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 text-sm">
        <Detail label="Source" value={p.source} />
        <Detail label="Project ID" value={p.external_id || "-"} />
        <Detail label="Region" value={p.region_group || "-"} />
        <Detail label="Country" value={p.country_iso3 || (p.scope === "REGIONAL" ? "—" : "-")} />
        <Detail label="Implementing Agency" value={p.agency_name || "-"} />
        <Detail label="Status" value={readable(p.status)} />
        <Detail label="Project Type" value={p.scope === "REGIONAL" ? "Regional" : p.scope === "GLOBAL" ? "Global" : "Country"} />
        <Detail label="Start date" value={fmtDate(p.start_date)} />
        <Detail label="End date" value={fmtDate(p.end_date)} />
        <Detail label="Financing (USD)" value={money(p.budget_usd)} />
      </div>

      <div className="mt-10 rounded-lg border bg-white">
        <div className="px-5 py-4 border-b">
          <b>Status timeline</b>
        </div>
        <StatusPanel p={p} />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-xs uppercase">{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
