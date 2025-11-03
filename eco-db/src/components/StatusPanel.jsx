export default function StatusPanel({ p }) {
  const fmtDate = (s) => (s ? new Date(s).toLocaleDateString() : "-");
  const money = (n) =>
    n == null
      ? "-"
      : n.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        });
  const daysBetween = (a, b) =>
    a && b ? Math.round((new Date(b) - new Date(a)) / 86400000) : null;
  const daysSince = (s) => (s ? daysBetween(s, new Date().toISOString()) : null);
  const daysToGo = (s) => (s ? daysBetween(new Date().toISOString(), s) : null);

  const s1 = p.pipeline_date ? daysBetween(p.pipeline_date, new Date().toISOString()) : null;
  const s2 = p.approved_date ? daysBetween(p.approved_date, new Date().toISOString()) : null;
  const sofar = daysSince(p.under_impl_start);
  const toGo = daysToGo(p.completion_target);

  const Row = ({ dot = "bg-gray-300", label, right }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-baseline">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm text-gray-600">{right}</div>
    </div>
  );

  return (
    <div className="px-6 py-4 border-t bg-gray-50">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Status timeline
          </h4>
          <div className="space-y-2">
            <Row label={<b>Project timeline / Pipeline</b>} right={<span>{fmtDate(p.pipeline_date)} {s1 != null && <>• {s1} days</>}</span>} />
            <Row dot="bg-gray-400" label={<b>Approved</b>} right={<span>{fmtDate(p.approved_date)} {s2 != null && <>• {s2} days</>}</span>} />
            <Row dot="bg-blue-500" label={<b>Under implementation</b>} right={<span>{fmtDate(p.under_impl_start)} {sofar != null && <>• {sofar} days so far</>}</span>} />
            <Row dot="bg-indigo-500" label={<b>FAA effective</b>} right={fmtDate(p.faa_effective_date)} />
            <Row dot="bg-purple-500" label={<><b>Disbursement</b> — {money(p.disbursement_usd)}</>} right={fmtDate(p.disbursement_date)} />
            <Row dot="bg-emerald-600" label={<b>To be completed</b>} right={<span>{fmtDate(p.completion_target)} {toGo != null && <>• {toGo} days to go</>}</span>} />
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Location & groups
          </h4>
          <div className="space-y-1 text-sm">
            <div>Scope: <b>{p.scope}</b></div>
            <div>Region: <b>{p.region_group || "-"}</b></div>
            <div>Country: <b>{p.country_iso3 || (p.scope === "REGIONAL" ? "—" : "-")}</b></div>
            <div>Agency: <b>{p.agency_name || "-"}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}