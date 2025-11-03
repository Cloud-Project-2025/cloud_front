import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import ActionsBar from "./components/ActionsBar.jsx";
import DataTable from "./components/DataTable.jsx";
import { useState } from "react";

const base = [
  { name:"Coastal resilience program for small island states", country:"FJI", region:"APAC" },
  { name:"Sustainable land management in Malawi", country:"MWI", region:"AFRICA" },
  { name:"Promoting adaptation for green jobs in Somalia", country:"SOM", region:"AFRICA" },
  { name:"Urban climate risk mitigation initiative", country:"COL", region:"LAC" },
  { name:"Renewable mini-grid expansion in rural areas", country:"KEN", region:"AFRICA" },
  { name:"Watershed restoration and livelihoods", country:"VNM", region:"APAC" },
  { name:"Climate-smart agriculture support facility", country:"ETH", region:"AFRICA" },
  { name:"Blue economy resilience enhancement", country:"MDV", region:"APAC" },
  { name:"Coastal mangrove rehabilitation project", country:"IDN", region:"APAC" },
];

const rowsData = Array.from({ length: 27 }, (_, i) => {
  const src = base[i % base.length];
  const start = new Date(2021, (i % 12), 1);
  const end = new Date(start); end.setMonth(end.getMonth() + 3);
  const fmt = (d) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "");
  
  const status = (i % 3 === 0) ? "예정" : (i % 3 === 1 ? "진행 중" : "완료");
  const money = (8000 + (i % 9) * 700) / 10; // 8.0k ~ 14.6k

  return {
    projNum: (i % 2 === 0 ? `GCF-FP${200 + i}` : `GEF-${11000 + i}`),
    name: src.name + (i >= base.length ? ` ${i + 1}` : ""),
    status,
    region: src.region,
    country: src.country,
    start: fmt(start),
    end: fmt(end),
    financing: `US$ ${money.toFixed(1)}k`,
  };
});

export default function App() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="min-h-screen flex bg-[#f6f8fb] text-slate-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <ActionsBar onSearch={setSearch} onStatusChange={setStatus} />
        <DataTable rows={rowsData} search={search} statusFilter={status} />
      </main>
    </div>
  );
}
